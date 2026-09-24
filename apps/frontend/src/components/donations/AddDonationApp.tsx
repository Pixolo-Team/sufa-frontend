// REACT //
import { memo, useCallback, useEffect, useState } from "react";

// STYLES //
import styles from "../operations/operations.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";
import PinGate from "../operations/PinGate";
import DonationForm from "./DonationForm";

const STAFF_PIN = import.meta.env.PUBLIC_STAFF_PIN ?? "";

const UNLOCK_STORAGE_KEY = "skorost-donation-unlocked";
const UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;

/** Static top bar - no state, memoised so form keystrokes never re-render it. */
const TopBar: React.FC = memo(() => {
	return (
		<div className={styles.topBar}>
			<a
				href="/donations"
				aria-label="Back to donations"
				className={styles.backButton}
			>
				<OperationsIcon name="back" size={20} />
			</a>

			<div className={styles.topBarTitle}>
				<b>Add Donation</b>
				<small>Record a new contribution</small>
			</div>

			<a href="https://zizoapp.in" target="_blank" rel="noopener noreferrer">
				<img
					className={styles.topBarLogo}
					src="/images/brand/zizo.svg"
					alt="Zizo"
					width="34"
					height="34"
				/>
			</a>
		</div>
	);
});

TopBar.displayName = "AddDonationTopBar";

/** Static side menu - active is constant here, memoised so it mounts once. */
const SideMenu: React.FC = memo(() => {
	return (
		<nav className={styles.rail} aria-label="Donations">
			<a href="/donations" className={styles.railItem}>
				<OperationsIcon name="heart" size={18} />
				Donations
			</a>
			<a
				href="/add-donation"
				className={`${styles.railItem} ${styles.railItemActive}`}
				aria-current="page"
			>
				<OperationsIcon name="user-plus" size={18} />
				Add Donation
			</a>
		</nav>
	);
});

SideMenu.displayName = "AddDonationSideMenu";

/** Staff-only donor entry. Same soft PIN gate as /operations - light obfuscation, not real auth. */
const AddDonationApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		const storedValue = window.sessionStorage.getItem(UNLOCK_STORAGE_KEY);
		const expiresAt = storedValue ? Number(storedValue) : 0;

		if (expiresAt > Date.now()) return true;

		window.sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
		return false;
	});

	const unlock = useCallback(() => {
		window.sessionStorage.setItem(
			UNLOCK_STORAGE_KEY,
			String(Date.now() + UNLOCK_TTL_MS)
		);
		setIsUnlocked(true);
	}, []);

	useEffect(() => {
		if (!STAFF_PIN) {
			console.error("Missing PUBLIC_STAFF_PIN. Set it in apps/frontend/.env.");
		}
	}, []);

	if (!isUnlocked) {
		return (
			<div className={`${styles.operations} ${styles.operationsGate}`}>
				<PinGate expectedPin={STAFF_PIN} onUnlock={unlock} />
			</div>
		);
	}

	return (
		<div className={styles.operations}>
			<div className={styles.shell}>
				<TopBar />
				<SideMenu />

				<div className={styles.panel}>
					<p className={styles.notice}>Staff tool. Not linked from the public site.</p>
					<DonationForm />
				</div>
			</div>
		</div>
	);
};

export default AddDonationApp;

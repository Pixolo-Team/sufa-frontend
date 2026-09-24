// REACT //
import { memo, useEffect, useMemo, useState } from "react";

// STYLES //
import styles from "../operations/operations.module.scss";

// COMPONENTS //
import OperationsIcon from "../operations/OperationsIcon";

// SERVICES //
import { fetchDonations } from "@/services/donations.api.service";

// TYPES //
import type { DonationData } from "@/types/donations";
import { formatDonationDate } from "@/types/donations";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";

/** Static top bar - no props, never re-renders after mount. */
const TopBar: React.FC = memo(() => {
	return (
		<div className={styles.topBar}>
			<span className={styles.brand}>
				<img
					className={styles.brandLogo}
					src="/images/skorost.svg"
					alt="Skorost United Football Academy"
					width="71"
					height="34"
				/>
			</span>

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

TopBar.displayName = "DonationsTopBar";

/** Static side menu - only `active` prop, skips re-render on list updates. */
const SideMenu: React.FC<{ active: "list" | "add" }> = memo(({ active }) => {
	return (
		<nav className={styles.rail} aria-label="Donations">
			<a
				href="/donations"
				className={`${styles.railItem} ${active === "list" ? styles.railItemActive : ""}`}
				aria-current={active === "list" ? "page" : undefined}
			>
				<OperationsIcon name="heart" size={18} />
				Donations
			</a>
			<a
				href="/add-donation"
				className={`${styles.railItem} ${active === "add" ? styles.railItemActive : ""}`}
				aria-current={active === "add" ? "page" : undefined}
			>
				<OperationsIcon name="user-plus" size={18} />
				Add Donation
			</a>
		</nav>
	);
});

SideMenu.displayName = "DonationsSideMenu";

/** Static CTA tile - no props, never re-renders. */
const AddDonationTile: React.FC = memo(() => {
	return (
		<div className={styles.tiles}>
			<a href="/add-donation" className={styles.tile}>
				<span className={styles.tileIcon}>
					<OperationsIcon name="user-plus" />
				</span>
				<span className={styles.tileText}>
					<b>Add Donation</b>
				</span>
				<OperationsIcon
					name="chevron"
					size={18}
					className={styles.tileChevron}
				/>
			</a>
		</div>
	);
});

AddDonationTile.displayName = "AddDonationTile";

/** Owns the fetch state so TopBar / SideMenu / Tile never re-render on load. */
const DonorWall: React.FC = memo(() => {
	const [donations, setDonations] = useState<DonationData[] | null>(null);
	const [loadError, setLoadError] = useState(false);

	useEffect(() => {
		let isActive = true;

		fetchDonations()
			.then((result) => {
				if (isActive) setDonations(result);
			})
			.catch(() => {
				if (isActive) setLoadError(true);
			});

		return () => {
			isActive = false;
		};
	}, []);

	const total = useMemo(
		() => (donations ?? []).reduce((sum, item) => sum + item.amount, 0),
		[donations]
	);

	if (loadError) {
		return (
			<p className={styles.notice}>
				Could not load donations. Check your connection and reload.
			</p>
		);
	}

	if (!donations) {
		return <p className={styles.notice}>Loading...</p>;
	}

	if (donations.length === 0) {
		return (
			<div className={styles.emptyState}>
				<span className={styles.emptyStateIcon}>
					<OperationsIcon name="pin" size={42} />
				</span>
				<h3>No donations yet</h3>
				<p>Contributions will appear here once they are added.</p>
			</div>
		);
	}

	return (
		<div className={styles.cardStack}>
			<section className={styles.card}>
				<div className={styles.centerHeader}>
					<div>
						<b>{formatRupees(total)} raised</b>
						<p className={styles.centerAddress}>
							{donations.length}{" "}
							{donations.length === 1 ? "contributor" : "contributors"}
						</p>
					</div>
				</div>
			</section>

			<section className={styles.card}>
				<div className={styles.centerHeader}>
					<div>
						<b>Contributors · {donations.length}</b>
					</div>
				</div>

				<table className={styles.plansTable}>
					<tbody>
						{donations.map((donation) => (
							<tr key={donation.id}>
								<td>
									<b>{donation.name}</b>
									<br />
									<small>
										{formatDonationDate(donation.donatedOn)}
										{donation.details ? ` · ${donation.details}` : ""}
									</small>
								</td>
								<td>{formatRupees(donation.amount)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</div>
	);
});

DonorWall.displayName = "DonorWall";

/**
 * Public donor wall - Name - date - amount - details, newest first. Same shell as /operations.
 * Shell is stateless so TopBar / SideMenu mount once and never re-render on data load.
 */
const DonationsApp: React.FC = () => {
	return (
		<div className={styles.operations}>
			<div className={styles.shell}>
				<TopBar />
				<SideMenu active="list" />

				<div className={`${styles.panel} ${styles.panelHome}`}>
					<AddDonationTile />
					<DonorWall />
				</div>
			</div>
		</div>
	);
};

export default DonationsApp;

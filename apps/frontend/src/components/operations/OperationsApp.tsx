// REACT //
import { useCallback, useEffect, useState } from "react";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import OperationsIcon, { type OperationsIconName } from "./OperationsIcon";
import PinGate from "./PinGate";
import PaymentQr from "./PaymentQr";
import BatchesList from "./BatchesList";

// SERVICES //
import { fetchOperationsData } from "@/services/operations.api.service";

// TYPES //
import type { OperationsData } from "@/types/operations";

const STAFF_PIN = import.meta.env.PUBLIC_STAFF_PIN ?? "";

const UNLOCK_STORAGE_KEY = "skorost-ops-unlocked";
const UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;

type ToolId = "batches" | "qr";

const TOOLS: {
	id: ToolId;
	icon: OperationsIconName;
	title: string;
	subtitle: string;
}[] = [
	{
		id: "batches",
		icon: "pin",
		title: "Batches",
		subtitle: "Prices & timings",
	},
	{
		id: "qr",
		icon: "qr",
		title: "Payments",
		subtitle: "QR & fee collection",
	},
];

/** Staff-only operations tools. Everything is computed and sent in the browser. */
const OperationsApp: React.FC = () => {
	const [isUnlocked, setIsUnlocked] = useState(() => {
		const storedValue = window.sessionStorage.getItem(UNLOCK_STORAGE_KEY);
		const expiresAt = storedValue ? Number(storedValue) : 0;

		if (expiresAt > Date.now()) return true;

		window.sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
		return false;
	});
	const [activeTool, setActiveTool] = useState<ToolId | null>(null);
	const [centerId, setCenterId] = useState("");
	const [data, setData] = useState<OperationsData | null>(null);
	const [loadError, setLoadError] = useState(false);

	const unlock = useCallback(() => {
		window.sessionStorage.setItem(
			UNLOCK_STORAGE_KEY,
			String(Date.now() + UNLOCK_TTL_MS)
		);
		setIsUnlocked(true);
	}, []);

	useEffect(() => {
		if (!isUnlocked) return;

		let isActive = true;

		fetchOperationsData()
			.then((result) => {
				if (!isActive) return;
				setData(result);
				setCenterId(result.centers[0]?.id ?? "");
			})
			.catch(() => {
				if (isActive) setLoadError(true);
			});

		return () => {
			isActive = false;
		};
	}, [isUnlocked]);

	if (!isUnlocked) {
		return (
			<div className={`${styles.operations} ${styles.operationsGate}`}>
				<PinGate expectedPin={STAFF_PIN} onUnlock={unlock} />
			</div>
		);
	}

	if (loadError) {
		return (
			<div className={styles.operations}>
				<div className={styles.shell}>
					<p className={styles.notice}>
						Could not load operations data. Check your connection and reload.
					</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className={styles.operations}>
				<div className={styles.shell}>
					<p className={styles.notice}>Loading...</p>
				</div>
			</div>
		);
	}

	const { config, centers, registrationOptions } = data;
	const center = centers.find((item) => item.id === centerId);
	const activeToolMeta = TOOLS.find((tool) => tool.id === activeTool);

	const renderPanel = () => {
		const toolProps = { centers, center, onCenterChange: setCenterId };

		switch (activeTool) {
			case "batches":
				return (
					<BatchesList
						centers={centers}
						config={config}
						registrationOptions={registrationOptions}
					/>
				);
			case "qr":
				return (
					<PaymentQr
						{...toolProps}
						config={config}
						registrationOptions={registrationOptions}
					/>
				);
			default:
				return (
					<div className={styles.tiles}>
						{TOOLS.map((tool) => (
							<button
								key={tool.id}
								type="button"
								className={styles.tile}
								onClick={() => setActiveTool(tool.id)}
							>
								<span className={styles.tileIcon}>
									<OperationsIcon name={tool.icon} />
								</span>
								<span className={styles.tileText}>
									<b>{tool.title}</b>
									<small>{tool.subtitle}</small>
								</span>
								<OperationsIcon
									name="chevron"
									size={18}
									className={styles.tileChevron}
								/>
							</button>
						))}
					</div>
				);
		}
	};

	return (
		<div className={styles.operations}>
			<div className={styles.shell}>
				<div className={styles.topBar}>
					{activeToolMeta ? (
						<>
							<button
								type="button"
								aria-label="Back"
								className={styles.backButton}
								onClick={() => setActiveTool(null)}
							>
								<OperationsIcon name="back" size={20} />
							</button>

							<div className={styles.topBarTitle}>
								<b>{activeToolMeta.title}</b>
								<small>{activeToolMeta.subtitle}</small>
							</div>
						</>
					) : (
						<span className={styles.brand}>
							<img
								className={styles.brandLogo}
								src="/images/skorost.svg"
								alt="Skorost United Football Academy"
								width="71"
								height="34"
							/>
						</span>
					)}

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

				<nav className={styles.rail}>
					{TOOLS.map((tool) => (
						<button
							key={tool.id}
							type="button"
							className={`${styles.railItem} ${
								activeTool === tool.id ? styles.railItemActive : ""
							}`}
							onClick={() => setActiveTool(tool.id)}
						>
							<OperationsIcon name={tool.icon} size={18} />
							{tool.title}
						</button>
					))}
				</nav>

				<div
					className={`${styles.panel} ${
						activeTool === null ? styles.panelHome : ""
					}`}
				>
					{activeTool !== "batches" && (
						<p className={styles.notice}>Staff tool. Not linked from the public site.</p>
					)}

					{renderPanel()}

					{activeTool === null && (
						<p className={styles.poweredBy}>
							<span>Powered by</span>
							<a href="https://zizoapp.in" target="_blank" rel="noopener noreferrer">
								<img
									src="/images/brand/zizo.svg"
									alt="Zizo"
									width="40"
									height="16"
								/>
							</a>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default OperationsApp;

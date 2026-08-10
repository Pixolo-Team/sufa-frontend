// REACT //
import { useCallback, useState } from "react";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import OperationsIcon, { type OperationsIconName } from "./OperationsIcon";
import PinGate from "./PinGate";
import FeeCalculator from "./FeeCalculator";
import FeeStructure from "./FeeStructure";
import PaymentQr from "./PaymentQr";
import CentersList from "./CentersList";

// DATA //
import { OPERATIONS_DATA } from "@/data/operations.data";

const UNLOCK_STORAGE_KEY = "skorost-ops-unlocked";

type ToolId = "calculator" | "structure" | "qr" | "centers";

const TOOLS: {
	id: ToolId;
	icon: OperationsIconName;
	title: string;
	subtitle: string;
}[] = [
	{
		id: "calculator",
		icon: "calculator",
		title: "Fee Calculator",
		subtitle: "Work out dues",
	},
	{
		id: "structure",
		icon: "message",
		title: "Fee Structure",
		subtitle: "Send on WhatsApp",
	},
	{ id: "qr", icon: "qr", title: "Payment QR", subtitle: "Global / student" },
	{
		id: "centers",
		icon: "pin",
		title: "Centers",
		subtitle: "Prices & timings",
	},
];

/** Staff-only operations tools. Everything is computed and sent in the browser. */
const OperationsApp: React.FC = () => {
	const { config, centers, registrationOptions } = OPERATIONS_DATA;

	const [isUnlocked, setIsUnlocked] = useState(
		() => window.localStorage.getItem(UNLOCK_STORAGE_KEY) === "true"
	);
	const [activeTool, setActiveTool] = useState<ToolId | null>(null);
	const [centerId, setCenterId] = useState(centers[0]?.id ?? "");

	const center = centers.find((item) => item.id === centerId);
	const activeToolMeta = TOOLS.find((tool) => tool.id === activeTool);

	const unlock = useCallback(() => {
		window.localStorage.setItem(UNLOCK_STORAGE_KEY, "true");
		setIsUnlocked(true);
	}, []);

	if (!isUnlocked) {
		return (
			<div className={`${styles.operations} ${styles.operationsGate}`}>
				<PinGate expectedPin={config.staffPin} onUnlock={unlock} />
			</div>
		);
	}

	const renderPanel = () => {
		const toolProps = { centers, center, onCenterChange: setCenterId };

		switch (activeTool) {
			case "calculator":
				return <FeeCalculator {...toolProps} registrationOptions={registrationOptions} />;
			case "structure":
				return (
					<FeeStructure
						{...toolProps}
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
			case "centers":
				return (
					<CentersList centers={centers} registrationOptions={registrationOptions} />
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
							<span className={styles.brandDivider} aria-hidden="true" />
							<span className={styles.brandLabel}>Ops</span>
						</span>
					)}

					<span className={styles.lockChip}>
						<OperationsIcon name="lock" size={12} />
						Unlocked
					</span>
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
					{activeTool !== "centers" && (
						<p className={styles.notice}>Staff tool. Not linked from the public site.</p>
					)}

					{renderPanel()}
				</div>
			</div>
		</div>
	);
};

export default OperationsApp;

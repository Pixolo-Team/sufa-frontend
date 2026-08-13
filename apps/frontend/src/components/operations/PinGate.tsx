// REACT //
import { memo, useCallback, useState } from "react";

// STYLES //
import styles from "./operations.module.scss";

const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

interface PinGateProps {
	expectedPin: string;
	onUnlock: () => void;
}

const GatePoweredBy: React.FC = memo(() => (
	<p className={`${styles.poweredBy} ${styles.gatePoweredBy}`}>
		<span>Powered by</span>
		<img src="/images/brand/zizo.svg" alt="Zizo" width="40" height="16" />
	</p>
));

GatePoweredBy.displayName = "GatePoweredBy";

/**
 * Shared staff PIN, compared in the browser. This is light obfuscation for an
 * unlisted internal tool, not real security - the PIN ships in the bundle.
 */
const PinGate: React.FC<PinGateProps> = ({ expectedPin, onUnlock }) => {
	// Define states
	const [pin, setPin] = useState("");
	const [hasError, setHasError] = useState(false);

	/** Append a digit and check the PIN once it is long enough */
	const pressKey = useCallback(
		(key: string) => {
			// Backspace
			if (key === "⌫") {
				setHasError(false);
				setPin((previous) => previous.slice(0, -1));
				return;
			}

			if (!key || pin.length >= PIN_LENGTH) return;

			const nextPin = pin + key;

			setHasError(false);
			setPin(nextPin);

			// Only judge a full-length PIN
			if (nextPin.length < PIN_LENGTH) return;

			if (nextPin === expectedPin) {
				onUnlock();
			} else {
				setHasError(true);
				// Clear so the next attempt starts from an empty pad
				window.setTimeout(() => setPin(""), 400);
			}
		},
		[pin, expectedPin, onUnlock]
	);

	return (
		<div className={styles.gate}>
			<img
				className={styles.gateLogo}
				src="/images/skorost.svg"
				alt="Skorost United Football Academy"
				width="71"
				height="34"
			/>

				<h1 className={styles.gateTitle}>Enter passcode</h1>
				<p className={styles.gateSubtitle}>Staff access only</p>

			{/* Filled dot per entered digit */}
			<div className={styles.pinDots}>
				{Array.from({ length: PIN_LENGTH }, (_, index) => (
					<span
						key={index}
						className={`${styles.pinDot} ${
							index < pin.length
								? hasError
									? styles.pinDotError
									: styles.pinDotFilled
								: ""
						}`}
					/>
				))}
			</div>

			<p className={styles.gateError}>{hasError ? "Wrong passcode" : ""}</p>

			<div className={styles.keypad}>
				{KEYS.map((key, index) => (
					<button
						key={`${key}-${index}`}
						type="button"
						aria-label={key === "⌫" ? "Delete" : key}
						disabled={!key}
						className={`${styles.key} ${key === "⌫" ? styles.keyGhost : ""}`}
						style={key ? undefined : { visibility: "hidden" }}
						onClick={() => pressKey(key)}
						>
							{key}
						</button>
					))}
				</div>

				<GatePoweredBy />
			</div>
		);
	};

export default PinGate;

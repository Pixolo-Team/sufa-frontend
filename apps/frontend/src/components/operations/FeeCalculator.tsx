// TYPES //
import type { OperationsCenterData } from "@/types/operations";

// STYLES //
import styles from "./operations.module.scss";

// COMPONENTS //
import FeeInputFields from "./FeeInputFields";

// HOOKS //
import { useFeeInputs } from "./use-fee-inputs";

// UTILS //
import { formatDisplayDate, formatRupees } from "@/utils/fee-calculator.util";

interface FeeCalculatorProps {
	centers: OperationsCenterData[];
	center: OperationsCenterData | undefined;
	onCenterChange: (centerId: string) => void;
}

/** Tool 1 - amount owed, including a mid-month start */
const FeeCalculator: React.FC<FeeCalculatorProps> = ({
	centers,
	center,
	onCenterChange,
}) => {
	const feeInputs = useFeeInputs(center);
	const { inputs, quote } = feeInputs;

	return (
		<div className={styles.cardStack}>
			<div className={styles.card}>
				<FeeInputFields
					centers={centers}
					center={center}
					onCenterChange={onCenterChange}
					feeInputs={feeInputs}
				/>
			</div>

			{quote && (
				<div className={styles.result}>
					<div className={styles.resultTotal}>
						<span>Total due</span>
						<b>{formatRupees(quote.total)}</b>
					</div>

					{quote.rows.map((row) => (
						<div key={row.id} className={styles.resultRow}>
							<span className={styles.resultRowLabel}>
								{row.label}
								<small>{row.detail}</small>
							</span>
							<span>{formatRupees(row.amount)}</span>
						</div>
					))}

					<p className={styles.resultFootnote}>
						{formatDisplayDate(inputs.startDate)} -{" "}
						{formatDisplayDate(inputs.endDate)} | prices as stored, no rounding
					</p>
				</div>
			)}
		</div>
	);
};

export default FeeCalculator;

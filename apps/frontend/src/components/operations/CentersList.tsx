// TYPES //
import type { OperationsCenterData } from "@/types/operations";

// STYLES //
import styles from "./operations.module.scss";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import {
	formatBatchTimings,
	formatPlanLabel,
} from "@/utils/operations.util";

interface CentersListProps {
	centers: OperationsCenterData[];
}

/** Compact center reference for quick staff lookup */
const CentersList: React.FC<CentersListProps> = ({ centers }) => (
	<div className={styles.card}>
		{centers.map((center) => (
			<div key={center.id} className={styles.centerItem}>
				<div className={styles.centerHeader}>
					<b>{center.name}</b>
				</div>

				<p className={styles.centerAddress}>{center.address}</p>

				<div className={styles.centerTimings}>
					{center.batches.map((batch) => (
						<div key={batch.id}>
							<p>
								<strong>{batch.name}</strong>
							</p>
							<p>{formatBatchTimings(batch)}</p>
							{batch.plans.map((plan) => (
								<p key={plan.id}>
									{formatPlanLabel(plan)}: <strong>{formatRupees(plan.price)}</strong>
								</p>
							))}
							{batch.registrationOptions.map((option) => (
								<p key={option.id}>
									{option.name}: <strong>{formatRupees(option.price)}</strong>
								</p>
							))}
						</div>
					))}
				</div>
			</div>
		))}
	</div>
);

export default CentersList;

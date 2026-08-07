// TYPES //
import type { OperationsCenterData } from "@/types/operations";

// STYLES //
import styles from "./operations.module.scss";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import { formatBatchTimings } from "@/utils/operations.util";

interface CentersListProps {
	centers: OperationsCenterData[];
}

/** Compact center reference for quick staff lookup */
const CentersList: React.FC<CentersListProps> = ({ centers }) => (
	<div className={styles.card}>
		{centers.map((center) => {
			const primaryPlans = center.plans.filter((plan) => plan.daysPerWeek !== 2);

			return (
				<div key={center.id} className={styles.centerItem}>
					<div className={styles.centerHeader}>
						<b>{center.name}</b>
						<div className={styles.centerPrices}>
							{primaryPlans.map((plan) => (
								<div key={plan.id} className={styles.centerPriceChip}>
									<span>{plan.durationMonths} Month{plan.durationMonths > 1 ? "s" : ""}</span>
									<strong>{formatRupees(plan.price)}</strong>
								</div>
							))}
						</div>
					</div>

					<p className={styles.centerAddress}>{center.address}</p>

					<div className={styles.centerTimings}>
						{center.batches.map((batch) => (
							<p key={batch.id}>{formatBatchTimings(batch)}</p>
						))}
					</div>
				</div>
			);
		})}
	</div>
);

export default CentersList;

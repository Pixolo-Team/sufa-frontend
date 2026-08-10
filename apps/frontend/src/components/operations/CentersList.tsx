// TYPES //
import type {
	OperationsCenterData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// STYLES //
import styles from "./operations.module.scss";

// UTILS //
import { formatRupees } from "@/utils/fee-calculator.util";
import {
	formatBatchTimingLines,
	formatPlanLabel,
} from "@/utils/operations.util";

interface CentersListProps {
	centers: OperationsCenterData[];
	registrationOptions: OperationsRegistrationOptionData[];
}

/** Compact center reference for quick staff lookup */
const CentersList: React.FC<CentersListProps> = ({
	centers,
	registrationOptions,
}) => (
	<div className={styles.cardStack}>
		<div className={styles.card}>
			<span className={styles.sectionLabel}>Registration options (all centers)</span>
			<div className={styles.centerRows}>
				{registrationOptions.map((option) => (
					<div key={option.id} className={styles.priceRow}>
						<span>
							{option.name}
							<small className={styles.priceRowDescription}>
								{option.description}
							</small>
						</span>
						<span>{formatRupees(option.price)}</span>
					</div>
				))}
			</div>
		</div>

		<div className={styles.card}>
			<div className={styles.centersList}>
				{centers.map((center) => (
					<section key={center.id} className={styles.centerItem}>
						<div className={styles.centerHeader}>
							<div>
								<b>{center.name}</b>
								<p className={styles.centerAddress}>{center.address}</p>
							</div>
						</div>

						<div className={styles.centerSections}>
							{center.batches.map((batch) => (
								<div key={batch.id} className={styles.centerBatch}>
									<div className={styles.centerBatchHeader}>
										<strong>{batch.name}</strong>
										<span className={styles.centerBatchMeta}>{batch.ageGroup}</span>
									</div>

									<div className={styles.centerScheduleList}>
										{formatBatchTimingLines(batch).map((line) => (
											<span key={`${batch.id}-${line}`} className={styles.centerSchedulePill}>
												{line}
											</span>
										))}
									</div>

									<div className={styles.centerBlock}>
										<span className={styles.centerBlockLabel}>Plans</span>
										<div className={styles.centerRows}>
											{batch.plans.map((plan) => (
												<div key={plan.id} className={styles.priceRow}>
													<span>{formatPlanLabel(plan)}</span>
													<span>{formatRupees(plan.price)}</span>
												</div>
											))}
										</div>
									</div>
								</div>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	</div>
);

export default CentersList;

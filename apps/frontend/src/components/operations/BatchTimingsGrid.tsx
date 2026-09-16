// STYLES //
import styles from "./operations.module.scss";

// TYPES //
import type { OperationsBatchData } from "@/types/operations";

// UTILS //
import { formatBatchScheduleGrid } from "@/utils/operations.util";

interface BatchTimingsGridProps {
	batch: OperationsBatchData;
}

/** Day/time/duration grid for a batch's weekly schedule - shared by the Batches page and Fee Payment. */
const BatchTimingsGrid: React.FC<BatchTimingsGridProps> = ({ batch }) => {
	const scheduleGrid = formatBatchScheduleGrid(batch);

	return (
		<div
			className={styles.timingGrid}
			style={{ "--timing-cols": scheduleGrid.length } as React.CSSProperties}
		>
			{scheduleGrid.map((slot) => (
				<div key={`${batch.id}-${slot.day}-${slot.time}`} className={styles.timingCell}>
					<strong>{slot.day}</strong>
					<span className={styles.timingTimeGroup}>
						<span>{slot.time}</span>
						{slot.duration && (
							<span className={styles.timingDuration}>({slot.duration})</span>
						)}
					</span>
				</div>
			))}
		</div>
	);
};

export default BatchTimingsGrid;

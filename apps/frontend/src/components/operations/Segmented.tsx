// STYLES //
import styles from "./operations.module.scss";

type SegmentedOption<T extends string | number> = {
	label: string;
	value: T;
};

interface SegmentedProps<T extends string | number> {
	label?: string;
	options: SegmentedOption<T>[];
	value: T;
	/** How many options fit in the row; the rest scroll horizontally */
	visibleCount?: number;
	onChange: (value: T) => void;
}

/** Two-or-three way switch, sized for thumbs */
const Segmented = <T extends string | number>({
	label = "",
	options,
	value,
	visibleCount,
	onChange,
}: SegmentedProps<T>) => (
	<div>
		{label && <span className={styles.fieldLabel}>{label}</span>}

		<div
			className={`${styles.segmented} ${visibleCount ? styles.segmentedPeek : ""}`}
			role="group"
			aria-label={label}
			style={
				visibleCount
					? ({ "--seg-visible": visibleCount } as React.CSSProperties)
					: undefined
			}
		>
			{options.map((option) => (
				<button
					key={String(option.value)}
					type="button"
					aria-pressed={option.value === value}
					className={`${styles.segmentedOption} ${
						option.value === value ? styles.segmentedOptionActive : ""
					}`}
					onClick={() => onChange(option.value)}
				>
					{option.label}
				</button>
			))}
		</div>
	</div>
);

export default Segmented;

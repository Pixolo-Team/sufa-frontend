// STYLES //
import styles from "./operations.module.scss";

type SegmentedOption<T extends string | number> = {
	label: string;
	value: T;
	isDisabled?: boolean;
};

interface SegmentedProps<T extends string | number> {
	label?: string;
	options: SegmentedOption<T>[];
	value: T;
	onChange: (value: T) => void;
}

/** Two-or-three way switch, sized for thumbs */
const Segmented = <T extends string | number>({
	label = "",
	options,
	value,
	onChange,
}: SegmentedProps<T>) => (
	<div>
		{label && <span className={styles.fieldLabel}>{label}</span>}

		<div className={styles.segmented} role="group" aria-label={label}>
			{options.map((option) => (
				<button
					key={String(option.value)}
					type="button"
					disabled={option.isDisabled}
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

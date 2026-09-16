// REACT //
import { useCallback, useLayoutEffect, useRef, useState } from "react";

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
	/** Optional wider-screen visible count for peek rows */
	desktopVisibleCount?: number;
	onChange: (value: T) => void;
}

/** Two-or-three way switch, sized for thumbs - the active pill slides to its target */
const Segmented = <T extends string | number>({
	label = "",
	options,
	value,
	visibleCount,
	desktopVisibleCount,
	onChange,
}: SegmentedProps<T>) => {
	const trackRef = useRef<HTMLDivElement>(null);
	const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
	const previousValueRef = useRef(value);
	const [highlight, setHighlight] = useState<{ left: number; width: number } | null>(
		null
	);

	// offsetLeft/offsetWidth are plain pixels, not percentages - they go stale
	// the moment the track's own width changes (viewport resize, rotation, a
	// sidebar toggling, fonts finishing load) without `value` itself changing.
	// Re-measuring only on [value, options, visibleCount] missed all of those,
	// leaving the pill pointing at a position sized for a layout that no
	// longer exists.
	const measure = useCallback(() => {
		const track = trackRef.current;
		const activeButton = buttonRefs.current.get(String(value));

		if (!track || !activeButton) {
			setHighlight(null);
			return;
		}

		const trackRect = track.getBoundingClientRect();
		const activeRect = activeButton.getBoundingClientRect();

		setHighlight({
			left: activeRect.left - trackRect.left + track.scrollLeft,
			width: activeRect.width,
		});
	}, [value]);

	useLayoutEffect(() => {
		measure();
	}, [measure, options, visibleCount, desktopVisibleCount]);

	useLayoutEffect(() => {
		measure();

		const previousValue = previousValueRef.current;

		previousValueRef.current = value;

		if (previousValue === value) return;

		const activeButton = buttonRefs.current.get(String(value));

		// The active option should be fully in view when it changes (e.g. picking
		// a duration further down a scrolled "peek" row like Number of months).
		activeButton?.scrollIntoView({ block: "nearest", inline: "nearest" });
	}, [measure, value]);

	useLayoutEffect(() => {
		const track = trackRef.current;

		if (!track) return;

		// A resize (rotation, viewport change) can settle in more than one
		// layout pass - re-measuring only on the observer's first callback
		// occasionally caught the row a few pixels before its final position.
		// One rAF later, layout has always settled.
		const observer = new ResizeObserver(() => {
			measure();
			requestAnimationFrame(measure);
		});

		observer.observe(track);

		return () => observer.disconnect();
	}, [measure]);

	return (
		<div>
			{label && <span className={styles.fieldLabel}>{label}</span>}

			<div
				ref={trackRef}
				className={`${styles.segmented} ${visibleCount ? styles.segmentedPeek : ""}`}
				role="group"
				aria-label={label}
				style={
					visibleCount
						? ({
								"--seg-visible": visibleCount,
								"--seg-visible-desktop": desktopVisibleCount ?? visibleCount,
							} as React.CSSProperties)
						: undefined
				}
			>
				{highlight && (
					<span
						className={styles.segmentedHighlight}
						style={{
							transform: `translateX(${highlight.left}px)`,
							width: highlight.width,
						}}
						aria-hidden="true"
					/>
				)}

				{options.map((option) => (
					<button
						key={String(option.value)}
						ref={(el) => {
							if (el) buttonRefs.current.set(String(option.value), el);
							else buttonRefs.current.delete(String(option.value));
						}}
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
};

export default Segmented;

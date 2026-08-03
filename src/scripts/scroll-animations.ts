// PLUGINS //
import ScrollOut from "scroll-out";
import { scroll, transform } from "motion";

/**
 * Registers the ScrollOut observers that drive the `.fade-in-up` reveal animation
 * and the `childrenToChampionsWrapper` viewport tracking.
 */
export const initScrollReveals = (): void => {
	// Fade In Up animations
	ScrollOut({
		targets: ".fade-in-up",
		once: true,
	});

	ScrollOut({
		targets: ".childrenToChampionsWrapper",
		cssProps: {
			viewportY: true,
		},
	});
};

/**
 * Applies a scroll linked animation to every element carrying `data-parallax`.
 * This is the vanilla equivalent of the `useScroll` + `useTransform` hooks that
 * `motion/react` provided: scroll progress across the target section is mapped
 * onto a transform, exactly as `<motion.div style={{ y }}>` used to do.
 *
 * The element declares what to animate through data attributes:
 * - `data-parallax="y"`     → vertical translate from `data-from` to `data-to`
 * - `data-parallax="x"`     → horizontal translate from `data-from` to `data-to`
 * - `data-parallax="scale"` → scale through the comma separated `data-values`
 *
 * `data-parallax-target` optionally points at a selector whose scroll progress
 * should be tracked instead of the element itself.
 */
export const initParallax = (): void => {
	const elements = document.querySelectorAll<HTMLElement>("[data-parallax]");

	elements.forEach((element) => {
		const type = element.dataset.parallax;

		// Resolve which element's scroll progress drives the animation
		const targetSelector = element.dataset.parallaxTarget;
		const target = targetSelector
			? (element.closest<HTMLElement>(targetSelector) ??
				document.querySelector<HTMLElement>(targetSelector))
			: element;

		if (!target) return;

		// Map scroll progress (0 → 1) onto the transform value, then onto a CSS transform
		const mapProgress =
			type === "scale"
				? transform(
						// Scale steps are spread evenly across the scroll range
						(element.dataset.values ?? "2,1.2,1")
							.split(",")
							.map((_, index, values) => index / (values.length - 1)),
						(element.dataset.values ?? "2,1.2,1")
							.split(",")
							.map((value) => Number(value))
					)
				: transform(
						[0, 1],
						[element.dataset.from ?? "-20%", element.dataset.to ?? "20%"]
					);

		/** Builds the CSS transform for the current scroll progress */
		const toTransform = (progress: number) => {
			const value = mapProgress(progress);

			if (type === "scale") return `scale(${value})`;
			return type === "x" ? `translateX(${value})` : `translateY(${value})`;
		};

		// Paint the starting frame, then keep it in sync with the scroll position
		element.style.transform = toTransform(0);

		scroll(
			(progress: number) => {
				element.style.transform = toTransform(progress);
			},
			{
				target,
				offset: ["start end", "end start"],
			}
		);
	});
};

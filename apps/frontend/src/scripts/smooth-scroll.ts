// PLUGINS //
import Lenis from "lenis";

/**
 * Boots Lenis smooth scrolling on the document.
 * Mirrors the `<ReactLenis root>` options used by the Next.js layout.
 */
export const initSmoothScroll = (): void => {
	const lenis = new Lenis({
		lerp: 0.5,
		smoothWheel: true,
		duration: 1.5,
	});

	/** Drive Lenis from the browser's animation frame loop */
	const raf = (time: number) => {
		lenis.raf(time);
		requestAnimationFrame(raf);
	};

	requestAnimationFrame(raf);
};

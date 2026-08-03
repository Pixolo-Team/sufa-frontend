// PLUGINS //
import Splide from "@splidejs/splide";
import type { Options } from "@splidejs/splide";

// STYLES //
import "@splidejs/splide/css/core";

/**
 * Mounts a Splide carousel and wires the custom previous/next arrows that sit
 * outside the carousel markup. Returns the instance, or `null` when the root
 * element is missing from the page.
 */
export const initCarousel = (
	rootSelector: string,
	options: Options
): Splide | null => {
	const root = document.querySelector<HTMLElement>(rootSelector);
	if (!root) return null;

	const carousel = new Splide(root, options).mount();

	// The arrows live in a sibling wrapper, so they are looked up by data attribute
	const arrowsWrapper = document.querySelector<HTMLElement>(
		`[data-slider-arrows="${root.dataset.slider}"]`
	);

	arrowsWrapper
		?.querySelector<HTMLButtonElement>("[data-slider-prev]")
		?.addEventListener("click", () => carousel.go("<"));

	arrowsWrapper
		?.querySelector<HTMLButtonElement>("[data-slider-next]")
		?.addEventListener("click", () => carousel.go(">"));

	return carousel;
};

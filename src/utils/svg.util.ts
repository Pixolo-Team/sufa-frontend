/** Attributes that can be forced onto an inlined `<svg>` root element */
interface SvgAttributes {
	class?: string;
	viewBox?: string;
	style?: string;
}

/**
 * Rewrites the opening `<svg>` tag of a raw SVG string so it carries the given attributes.
 * This replaces what `@svgr/webpack` used to do when SVGs were imported as React components.
 */
export const applySvgAttributes = (
	rawSvg: string,
	attributes: SvgAttributes
): string => {
	return rawSvg.replace(/<svg\b([^>]*)>/, (_match, existingAttributes: string) => {
		let attributesString = existingAttributes;

		// Overwrite the attributes that were explicitly passed in
		for (const [name, value] of Object.entries(attributes)) {
			if (!value) continue;

			const attributePattern = new RegExp(`\\s${name}="[^"]*"`, "i");

			attributesString = attributePattern.test(attributesString)
				? attributesString.replace(attributePattern, ` ${name}="${value}"`)
				: `${attributesString} ${name}="${value}"`;
		}

		return `<svg${attributesString}>`;
	});
};

/** The root `<svg>` attributes and inner markup of a parsed SVG string */
interface ParsedSvg {
	attributes: Record<string, string>;
	innerHtml: string;
}

// Attributes that React spells differently from plain HTML
const REACT_ATTRIBUTE_NAMES: Record<string, string> = {
	"xmlns:xlink": "xmlnsXlink",
	"xml:space": "xmlSpace",
};

/**
 * Splits a raw SVG string into the root element's attributes and its inner markup,
 * so a React component can re-render it as a real `<svg>` element rather than a wrapper.
 * Attribute names are camel-cased to match what React expects.
 */
export const parseSvg = (rawSvg: string): ParsedSvg => {
	const [, rawAttributes = "", innerHtml = ""] =
		rawSvg.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/) ?? [];

	const attributes: Record<string, string> = {};

	for (const [, name, value] of rawAttributes.matchAll(
		/([\w:-]+)="([^"]*)"/g
	)) {
		// `fill-rule` → `fillRule`, `xmlns:xlink` → `xmlnsXlink`, and so on
		const reactName =
			REACT_ATTRIBUTE_NAMES[name] ??
			name.replace(/-([a-z])/g, (_, character: string) =>
				character.toUpperCase()
			);

		attributes[reactName] = value;
	}

	return { attributes, innerHtml };
};

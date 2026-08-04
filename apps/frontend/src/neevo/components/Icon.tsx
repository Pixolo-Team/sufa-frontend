// REACT //
import React, { useMemo } from "react";

// UTILS //
import { parseSvg } from "@/utils/svg.util";

// Eagerly inline every icon in `public/icons` as a raw SVG string.
// This replaces the per-icon `@svgr/webpack` imports used by the Next.js build.
const iconModules = import.meta.glob<string>("../../../public/icons/**/*.svg", {
	query: "?raw",
	import: "default",
	eager: true,
});

// Error code icons are stored under their numeric file name but referenced by a slug
const FILE_NAME_ALIASES: Record<string, string> = {
	"404": "not-found",
	"400": "bad-request",
	"500": "internal-server-error",
};

/** Lookup of raw SVG markup, keyed by mode and then by icon name */
const iconMap: Record<string, Record<string, string>> = {
	filled: {},
	outline: {},
};

for (const [path, rawSvg] of Object.entries(iconModules)) {
	const [, mode, fileName] =
		path.match(/\/icons\/(filled|outline)\/(.+)\.svg$/) ?? [];
	if (!mode || !fileName) continue;

	iconMap[mode][FILE_NAME_ALIASES[fileName] ?? fileName] = rawSvg;
}

// Interface for Icon Props.
interface IconProps {
	iconName: string;
	className: string;
	mode?: "filled" | "outline";
}

/** Icon Component */
const Icon: React.FC<IconProps> = ({
	iconName,
	className,
	mode = "outline",
}) => {
	// Resolve the raw markup for the requested icon and split it into svg attributes + contents
	const parsedIcon = useMemo(() => {
		const rawSvg = iconMap[mode]?.[iconName];
		return rawSvg ? parseSvg(rawSvg) : null;
	}, [iconName, mode]);

	if (!parsedIcon) {
		// Render a placeholder or an error message for unknown component names
		return <div>Unknown component: {iconName}</div>;
	}

	// Render the icon as a real <svg> element so no extra wrapper enters the DOM
	return (
		<svg
			{...parsedIcon.attributes}
			className={className}
			viewBox="0 0 20 20"
			dangerouslySetInnerHTML={{ __html: parsedIcon.innerHtml }}
		/>
	);
};

export default Icon;

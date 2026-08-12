export type OperationsIconName =
	| "qr"
	| "pin"
	| "chevron"
	| "back"
	| "lock";

/** Stroke paths, drawn on a 24×24 grid in `currentColor` */
const ICON_PATHS: Record<OperationsIconName, React.ReactNode> = {
	qr: (
		<>
			<rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
			<rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
			<rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
			<line x1="13.5" y1="13.5" x2="13.5" y2="20.5" />
			<line x1="17" y1="13.5" x2="20.5" y2="13.5" />
			<line x1="20.5" y1="17" x2="20.5" y2="20.5" />
		</>
	),
	pin: (
		<>
			<path d="M12 21c4-4.5 6-7.6 6-10a6 6 0 10-12 0c0 2.4 2 5.5 6 10z" />
			<circle cx="12" cy="11" r="2.25" />
		</>
	),
	chevron: <path d="M9 5l7 7-7 7" />,
	back: (
		<>
			<path d="M19 12H5" />
			<path d="M11 6l-6 6 6 6" />
		</>
	),
	lock: (
		<>
			<rect x="5" y="10.5" width="14" height="10" rx="2.5" />
			<path d="M8.5 10.5V7.75a3.5 3.5 0 017 0v2.75" />
		</>
	),
};

interface OperationsIconProps {
	name: OperationsIconName;
	size?: number;
	className?: string;
}

/** Line icons for the ops tools - inlined so there is no extra request */
const OperationsIcon: React.FC<OperationsIconProps> = ({
	name,
	size = 22,
	className = "",
}) => (
	<svg
		className={className}
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth={1.75}
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		{ICON_PATHS[name]}
	</svg>
);

export default OperationsIcon;

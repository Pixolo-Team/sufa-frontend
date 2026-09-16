export type OperationsIconName =
	| "calculator"
	| "message"
	| "qr"
	| "pin"
	| "chevron"
	| "back"
	| "lock";

/** Stroke paths, drawn on a 24×24 grid in `currentColor` */
const ICON_PATHS: Record<OperationsIconName, React.ReactNode> = {
	calculator: (
		<>
			<rect x="4" y="3" width="16" height="18" rx="2.5" />
			<line x1="8" y1="7.5" x2="16" y2="7.5" />
			<line x1="8.5" y1="12" x2="10.5" y2="12" />
			<line x1="13.5" y1="12" x2="15.5" y2="12" />
			<line x1="8.5" y1="16.5" x2="10.5" y2="16.5" />
			<line x1="13.5" y1="16.5" x2="15.5" y2="16.5" />
		</>
	),
	message: (
		<>
			<path d="M4 5.5h16v11H9l-5 4z" />
			<line x1="8" y1="9.5" x2="16" y2="9.5" />
			<line x1="8" y1="12.75" x2="13" y2="12.75" />
		</>
	),
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

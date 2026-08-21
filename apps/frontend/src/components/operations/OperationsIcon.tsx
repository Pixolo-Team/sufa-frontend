export type OperationsIconName =
	| "qr-code"
	| "pin"
	| "chevron"
	| "back"
	| "lock"
	| "user-plus"
	| "calendar-check"
	| "info-book";

/** Stroke paths, drawn on a 24×24 grid in `currentColor` */
const ICON_PATHS: Record<OperationsIconName, React.ReactNode> = {
	"qr-code": (
		<>
			<rect width="5" height="5" x="3" y="3" rx="1" />
			<rect width="5" height="5" x="16" y="3" rx="1" />
			<rect width="5" height="5" x="3" y="16" rx="1" />
			<path d="M21 16h-3a2 2 0 0 0-2 2v3" />
			<path d="M21 21v.01" />
			<path d="M12 7v3a2 2 0 0 1-2 2H7" />
			<path d="M3 12h.01" />
			<path d="M12 3h.01" />
			<path d="M12 16v.01" />
			<path d="M16 12h1" />
			<path d="M21 12v.01" />
			<path d="M12 21v-1" />
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
	"user-plus": (
		<>
			<circle cx="9.5" cy="8" r="3.25" />
			<path d="M3.5 20c0-3.5 2.7-6 6-6s6 2.5 6 6" />
			<path d="M18 8v6" />
			<path d="M15 11h6" />
		</>
	),
	"calendar-check": (
		<>
			<rect x="4" y="5.5" width="16" height="14.5" rx="2" />
			<path d="M4 10h16" />
			<path d="M8 3.5v3" />
			<path d="M16 3.5v3" />
			<path d="M9 14.5l2 2 4-4" />
		</>
	),
	"info-book": (
		<>
			<path d="M4 5.5A2 2 0 016 3.5h13v14H6a2 2 0 00-2 2z" />
			<path d="M4 19.5a2 2 0 012-2h13v3H6a2 2 0 01-2-2z" />
			<path d="M9.5 8h6" />
			<path d="M9.5 11.5h4" />
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

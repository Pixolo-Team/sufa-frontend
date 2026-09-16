// Small lucide-equivalent icon set, inlined so this page doesn't need the
// lucide-react dependency just for six glyphs copied from the source design.

type IconProps = { className?: string };

const base = {
	xmlns: "http://www.w3.org/2000/svg",
	width: 24,
	height: 24,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2,
	strokeLinecap: "round" as const,
	strokeLinejoin: "round" as const,
};

export const ArrowDownIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<path d="M12 5v14" />
		<path d="m19 12-7 7-7-7" />
	</svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<circle cx="12" cy="12" r="10" />
		<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
		<path d="M2 12h20" />
	</svg>
);

export const InstagramIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
		<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
		<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
	</svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
		<path d="m10 15 5-3-5-3z" />
	</svg>
);

export const WhatsappIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
	</svg>
);

export const PhoneIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
	</svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className }) => (
	<svg {...base} className={className}>
		<circle cx="12" cy="12" r="10" />
		<path d="m9 12 2 2 4-4" />
	</svg>
);

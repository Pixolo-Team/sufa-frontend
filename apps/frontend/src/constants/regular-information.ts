// PLACEHOLDER CONTENT
// ===================
// Every string and image path in this file is dummy content standing in for
// the real assets, which are still pending from Abhay. The Regular
// Information page's layout and behaviour are final; only the values here
// need swapping once the real PDF copy, photos, banners, size chart and
// jersey prices land. Nothing outside this file should need to change.

export type RegularInfoSection = {
	id: string;
	title: string;
	description: string;
	/** Rendered as a copyable text block */
	copyText?: string;
	/** Short caveat shown under a table - the part that doesn't fit in columns */
	note?: string;
	/** Rendered as a downloadable/copyable image */
	image?: {
		src: string;
		alt: string;
	};
	/** Rendered as a copyable table */
	table?: {
		headers: string[];
		rows: string[][];
	};
};

const AIFF_CRS_TEXT = `What is the AIFF CRS?

The AIFF Centralised Registration System (CRS) is the All India Football Federation's official player registration platform. Every player who takes part in AIFF-affiliated competitions must be registered on it.

Why it is needed:
- It creates a single verified identity for each player across all Indian football competitions.
- It confirms a player's age and eligibility for their age group, which keeps age-group football fair.
- It links the player to their club or academy, so transfers and participation history are traceable.
- It is mandatory for entry into AIFF-affiliated tournaments and leagues.

What parents need to provide:
- The player's birth certificate or Aadhaar card
- A recent passport-size photograph
- The parent or guardian's contact details

Registration is completed by the academy. Parents do not need to create an account themselves.`;

// Tabular sections deliberately have no `copyText` twin - the table is the
// single source of truth, and "Copy table" already emits paste-ready text.
// Anything that doesn't fit a table (caveats, terms) goes in `note`.

export const REGULAR_INFO_SECTIONS: RegularInfoSection[] = [
	{
		id: "aiff-crs",
		title: "AIFF CRS",
		description: "What it is and why registration is required.",
		copyText: AIFF_CRS_TEXT,
	},
	{
		id: "registration-package",
		title: "Registration Package",
		description: "The package photo shared with new joiners.",
		image: {
			src: "/images/operations/regular-info/registration-package.svg",
			alt: "Skorost United registration package",
		},
	},
	{
		id: "banner-all-venues",
		title: "All Venues Banner",
		description: "Skorost banner listing every centre.",
		image: {
			src: "/images/operations/regular-info/banner-all-venues.svg",
			alt: "Skorost United all venues banner",
		},
	},
	{
		id: "banner-ghatkopar-east",
		title: "Ghatkopar East Banner",
		description: "Centre-specific banner.",
		image: {
			src: "/images/operations/regular-info/banner-ghatkopar-east.svg",
			alt: "Skorost United Ghatkopar East banner",
		},
	},
	{
		id: "banner-ghatkopar-west",
		title: "Ghatkopar West Banner",
		description: "Centre-specific banner.",
		image: {
			src: "/images/operations/regular-info/banner-ghatkopar-west.svg",
			alt: "Skorost United Ghatkopar West banner",
		},
	},
	{
		id: "size-chart",
		title: "Size Chart",
		description: "Jersey sizing by chest, length and age.",
		image: {
			src: "/images/operations/regular-info/size-chart.svg",
			alt: "Skorost United jersey size chart",
		},
		table: {
			headers: ["Size", "Chest", "Length", "Age"],
			rows: [
				["XS", "30\"", "22\"", "5-6"],
				["S", "32\"", "24\"", "7-8"],
				["M", "34\"", "26\"", "9-10"],
				["L", "36\"", "27\"", "11-12"],
				["XL", "38\"", "28\"", "13-14"],
				["XXL", "40\"", "29\"", "15-16"],
			],
		},
		note: "Sizes are approximate. When a player is between two sizes, we recommend the larger one.",
	},
	{
		id: "jersey-prices",
		title: "Jersey Prices",
		description: "Current kit and jersey pricing.",
		table: {
			headers: ["Item", "Price"],
			rows: [
				["Home Jersey", "Rs. 850"],
				["Away Jersey", "Rs. 850"],
				["Shorts", "Rs. 450"],
				["Socks", "Rs. 200"],
				["Full Kit", "Rs. 1,400"],
				["Training T-shirt", "Rs. 600"],
				["Name & number printing", "Rs. 150 / item"],
			],
		},
		note: "All prices include GST.",
	},
];

export type RegularInfoSection = {
	id: string;
	title: string;
	description: string;
	/** Rendered as a copyable text block */
	copyText?: string;
	/** Rendered as nested copyable accordion rows */
	accordions?: {
		id: string;
		title: string;
		copyText: string;
	}[];
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

const AIFF_CRS_ITEMS = [
	{
		id: "what-is-aiff-crs",
		title: "What is the AIFF CRS?",
		copyText:
			"The AIFF Centralised Registration System (CRS) is the All India Football Federation's official player registration platform. Every player who takes part in AIFF-affiliated competitions must be registered on it.",
	},
	{
		id: "why-it-is-needed",
		title: "Why it is needed",
		copyText: `- It creates a single verified identity for each player across all Indian football competitions.
- It confirms a player's age and eligibility for their age group, which keeps age-group football fair.
- It links the player to their club or academy, so transfers and participation history are traceable.
- It is mandatory for entry into AIFF-affiliated tournaments and leagues.`,
	},
	{
		id: "documents-required",
		title: "What parents need to provide",
		copyText: `- The player's birth certificate or Aadhaar card
- A recent passport-size photograph
- The parent or guardian's contact details`,
	},
	{
		id: "academy-completion",
		title: "Who completes registration?",
		copyText:
			"Registration is completed by the academy. Parents do not need to create an account themselves.",
	},
];

// Tabular sections deliberately have no `copyText` twin - the table is the
// single source of truth, and "Copy table" already emits paste-ready text.
// Anything that doesn't fit a table (caveats, terms) goes in `note`.

export const REGULAR_INFO_SECTIONS: RegularInfoSection[] = [
	{
		id: "aiff-crs",
		title: "AIFF CRS",
		description: "What it is and why registration is required.",
		copyText: AIFF_CRS_TEXT,
		accordions: AIFF_CRS_ITEMS,
		image: {
			src: "/images/operations/regular-info/aiff-docs.png",
			alt: "AIFF CRS document requirements",
		},
	},
	{
		id: "main-pamphlet",
		title: "Main Pamphlet",
		description: "Primary programme pamphlet for sharing with parents.",
		image: {
			src: "/images/operations/regular-info/main-pamphlet.png",
			alt: "Skorost United main programme pamphlet",
		},
	},
	{
		id: "banner",
		title: "Banner",
		description: "Skorost banner for regular sharing.",
		image: {
			src: "/images/operations/regular-info/banner.png",
			alt: "Skorost United banner",
		},
	},
	{
		id: "size-chart",
		title: "Size Chart",
		description: "Yearwise jersey size mapping.",
		image: {
			src: "/images/operations/regular-info/size-chart.png",
			alt: "Skorost United jersey size chart",
		},
	},
	{
		id: "fee-structure",
		title: "Fee Structure",
		description: "Current programme fee structure.",
		image: {
			src: "/images/operations/regular-info/fee-structure-new-jersey.png",
			alt: "Skorost United fee structure",
		},
	},
];

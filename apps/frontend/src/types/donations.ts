/** One row on the public donor wall (/donations). */
export type DonationData = {
	id: string;
	name: string;
	amount: number;
	details: string;
	/** `YYYY-MM-DD` from the `donated_on` date column. */
	donatedOn: string;
};

/** Fields the staff form (/add-donation) collects. */
export type CreateDonationInput = {
	name: string;
	amount: number;
	details: string;
	/** `YYYY-MM-DD`. Defaults to today when left empty. */
	donatedOn: string;
};

/** `2026-09-21` -> `21 September, 2026`. Parsed manually so timezone shifts can't move the day. */
export const formatDonationDate = (donatedOn: string): string => {
	const [year, month, day] = donatedOn.split("-").map(Number);

	if (!year || !month || !day) return donatedOn;

	const monthName = new Date(year, month - 1, 1).toLocaleString("en-IN", {
		month: "long",
	});

	return `${day} ${monthName}, ${year}`;
};

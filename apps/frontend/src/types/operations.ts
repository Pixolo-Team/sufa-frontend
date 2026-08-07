/** A coach at a center - used as the "sent by" on a fee structure */
export type OperationsCoachData = {
	id: string;
	name: string;
	phone?: string;
};

/** A scheduled group within a center. Timings and session days live here. */
export type OperationsBatchData = {
	id: string;
	name: string;
	startTime: string;
	endTime: string;
	/** Session weekdays as JS day numbers (0 = Sunday). Vary by center/batch. */
	days: number[];
};

/**
 * A plan sold at a center. Both prices are stored, so partial months multiply a
 * stored per-session price - there is no rate derivation and no rounding.
 */
export type OperationsPlanData = {
	id: string;
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	price: number;
	perSessionPrice: number;
};

/** A center with everything the tools need */
export type OperationsCenterData = {
	id: string;
	name: string;
	address: string;
	coaches: OperationsCoachData[];
	batches: OperationsBatchData[];
	plans: OperationsPlanData[];
};

/** Values shared across every center */
export type OperationsConfigData = {
	academyName: string;
	upiId: string;
	payeeName: string;
	staffPin: string;
};

/** The whole payload the page needs - mirrors `GET /operations/centers` */
export type OperationsData = {
	config: OperationsConfigData;
	centers: OperationsCenterData[];
};

/** One line item in the fee breakdown */
export type FeeBreakdownRowData = {
	id: string;
	label: string;
	detail: string;
	amount: number;
	isFullMonth: boolean;
};

/** The result of a fee calculation */
export type FeeQuoteData = {
	rows: FeeBreakdownRowData[];
	total: number;
	sessionCount: number;
};

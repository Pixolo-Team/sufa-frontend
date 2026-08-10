/** A coach at a center - used as the "sent by" on a fee structure */
export type OperationsCoachData = {
	id: string;
	name: string;
	phone?: string;
};

/** One weekday slot inside a batch schedule. */
export type OperationsBatchTimingData = {
	day: number;
	startTime: string;
	endTime: string;
};

/** A plan sold inside a specific batch. */
export type OperationsPlanData = {
	id: string;
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	price: number;
	perSessionPrice: number;
};

/** Optional registration fee that can be added to the student's total. */
export type OperationsRegistrationOptionData = {
	id: string;
	name: string;
	price: number;
};

/** A scheduled group within a center. Schedule, plans and registration live here. */
export type OperationsBatchData = {
	id: string;
	name: string;
	schedule: OperationsBatchTimingData[];
	plans: OperationsPlanData[];
	registrationOptions: OperationsRegistrationOptionData[];
};

/** A center with everything the tools need */
export type OperationsCenterData = {
	id: string;
	name: string;
	address: string;
	coaches: OperationsCoachData[];
	batches: OperationsBatchData[];
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

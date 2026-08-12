// Shared operations types. Mirrors the batch-linked payload returned by
// GET /operations/centers. Frontend imports an equivalent shape locally.

export interface OpsConfig {
	academyName: string;
	upiId: string;
	payeeName: string;
	staffPin: string;
}

export interface OpsCoach {
	id: string;
	name: string;
	phone?: string;
}

export interface OpsBatchTiming {
	day: number;
	startTime: string;
	endTime: string;
}

export interface OpsPlan {
	id: string;
	name: string;
	durationMonths: number;
	daysPerWeek: number;
	price: number;
	perSessionPrice: number;
}

export interface OpsRegistrationOption {
	id: string;
	name: string;
	price: number;
}

export interface OpsBatch {
	id: string;
	name: string;
	schedule: OpsBatchTiming[];
	plans: OpsPlan[];
	registrationOptions: OpsRegistrationOption[];
}

export interface OpsCenter {
	id: string;
	name: string;
	address: string;
	coaches: OpsCoach[];
	batches: OpsBatch[];
}

export interface OperationsData {
	config: OpsConfig;
	centers: OpsCenter[];
}

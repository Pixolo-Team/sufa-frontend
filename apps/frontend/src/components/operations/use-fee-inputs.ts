// REACT //
import { useCallback, useEffect, useMemo, useState } from "react";

// TYPES //
import type {
	FeeQuoteData,
	OperationsBatchData,
	OperationsCenterData,
	OperationsPlanData,
	OperationsRegistrationOptionData,
} from "@/types/operations";

// UTILS //
import {
	calculateFeeQuote,
	getDefaultEndDate,
	getFixedTermEndDate,
	toDateInputValue,
} from "@/utils/fee-calculator.util";
import { formatPlanLabel, getBatchWeekdays } from "@/utils/operations.util";

/** Weekday labels indexed by JS day number */
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type FeeInputsState = {
	batchId: string;
	planId: string;
	registrationOptionId: string;
	selectedWeekdays: number[];
	startDate: string;
	endDate: string;
};

const buildInitialState = (): FeeInputsState => {
	const today = toDateInputValue(new Date());

	return {
		batchId: "",
		planId: "",
		registrationOptionId: "",
		selectedWeekdays: [],
		startDate: today,
		endDate: getDefaultEndDate(today),
	};
};

const getInitialPlanId = (batch: OperationsBatchData | undefined): string =>
	batch?.plans[0]?.id ?? "";

const getBatchDays = (batch: OperationsBatchData | undefined): number[] =>
	batch ? getBatchWeekdays(batch) : [];

const syncDatesForPlan = (startDate: string, plan: OperationsPlanData | undefined) =>
	plan && plan.durationMonths > 1
		? {
				startDate: `${startDate.slice(0, 8)}01`,
				endDate: getFixedTermEndDate(
					`${startDate.slice(0, 8)}01`,
					plan.durationMonths
				),
			}
		: {
				startDate,
				endDate: getDefaultEndDate(startDate),
			};

export const useFeeInputs = (center: OperationsCenterData | undefined) => {
	const [inputs, setInputs] = useState<FeeInputsState>(buildInitialState);

	const batch = useMemo(
		() => center?.batches.find((item) => item.id === inputs.batchId),
		[center, inputs.batchId]
	);

	const plan: OperationsPlanData | undefined = useMemo(
		() => batch?.plans.find((item) => item.id === inputs.planId) ?? batch?.plans[0],
		[batch, inputs.planId]
	);

	const registrationOption: OperationsRegistrationOptionData | undefined =
		useMemo(
			() =>
				batch?.registrationOptions.find(
					(item) => item.id === inputs.registrationOptionId
				),
			[batch, inputs.registrationOptionId]
		);

	const batchWeekdays = useMemo(
		() => (batch ? getBatchWeekdays(batch) : []),
		[batch]
	);
	const isFixedTerm = (plan?.durationMonths ?? 0) > 1;

	const billedWeekdays = useMemo(() => {
		if (!plan) return [];
		if (plan.daysPerWeek >= batchWeekdays.length) return batchWeekdays;

		return inputs.selectedWeekdays.length === plan.daysPerWeek
			? inputs.selectedWeekdays
			: batchWeekdays.slice(0, plan.daysPerWeek);
	}, [batchWeekdays, inputs.selectedWeekdays, plan]);

	const baseQuote: FeeQuoteData | null = useMemo(() => {
		if (!batch || !plan) return null;

		if (isFixedTerm) {
			return {
				rows: [
					{
						id: plan.id,
						label: formatPlanLabel(plan),
						detail: "Flat term price. Starts on the 1st",
						amount: plan.price,
						isFullMonth: true,
					},
				],
				total: plan.price,
				sessionCount: 0,
			};
		}

		return calculateFeeQuote({
			startDate: inputs.startDate,
			endDate: inputs.endDate,
			sessionWeekdays: billedWeekdays,
			monthlyPrice: plan.price,
			perSessionPrice: plan.perSessionPrice,
		});
	}, [
		batch,
		plan,
		isFixedTerm,
		inputs.startDate,
		inputs.endDate,
		billedWeekdays,
	]);

	const quote: FeeQuoteData | null = useMemo(() => {
		if (!baseQuote) return null;
		if (!registrationOption) return baseQuote;

		return {
			rows: [
				...baseQuote.rows,
				{
					id: registrationOption.id,
					label: registrationOption.name,
					detail: "Registration fee",
					amount: registrationOption.price,
					isFullMonth: true,
				},
			],
			total: baseQuote.total + registrationOption.price,
			sessionCount: baseQuote.sessionCount,
		};
	}, [baseQuote, registrationOption]);

	useEffect(() => {
		setInputs((previous) => {
			if (!center) return buildInitialState();

			const nextBatchId = center.batches.some((item) => item.id === previous.batchId)
				? previous.batchId
				: "";
			const nextBatch = center.batches.find((item) => item.id === nextBatchId);
			const nextPlanId =
				nextBatch?.plans.some((item) => item.id === previous.planId)
					? previous.planId
					: getInitialPlanId(nextBatch);
			const nextRegistrationOptionId =
				nextBatch?.registrationOptions.some(
					(item) => item.id === previous.registrationOptionId
				)
					? previous.registrationOptionId
					: "";
			const nextPlan = nextBatch?.plans.find((item) => item.id === nextPlanId);
			const nextDates = syncDatesForPlan(previous.startDate, nextPlan);

			return {
				...previous,
				batchId: nextBatchId,
				planId: nextPlanId,
				registrationOptionId: nextRegistrationOptionId,
				selectedWeekdays: previous.selectedWeekdays.filter((day) =>
					getBatchDays(nextBatch).includes(day)
				),
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [center]);

	const setBatchId = useCallback((batchId: string) => {
		setInputs((previous) => {
			const nextBatch = center?.batches.find((item) => item.id === batchId);
			const nextPlanId = getInitialPlanId(nextBatch);
			const nextPlan = nextBatch?.plans.find((item) => item.id === nextPlanId);
			const nextDates = syncDatesForPlan(previous.startDate, nextPlan);

			return {
				...previous,
				batchId,
				planId: nextPlanId,
				registrationOptionId: "",
				selectedWeekdays: [],
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [center]);

	const setPlanId = useCallback((planId: string) => {
		setInputs((previous) => {
			const nextPlan = batch?.plans.find((item) => item.id === planId);
			const nextDates = syncDatesForPlan(previous.startDate, nextPlan);

			return {
				...previous,
				planId,
				selectedWeekdays: [],
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [batch]);

	const setRegistrationOptionId = useCallback((registrationOptionId: string) => {
		setInputs((previous) => ({ ...previous, registrationOptionId }));
	}, []);

	const setStartDate = useCallback((startDate: string) => {
		setInputs((previous) => {
			const nextDates = syncDatesForPlan(startDate, plan);

			return {
				...previous,
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [plan]);

	const setEndDate = useCallback((endDate: string) => {
		setInputs((previous) => ({ ...previous, endDate }));
	}, []);

	const toggleWeekday = useCallback((weekday: number) => {
		setInputs((previous) => {
			const daysPerWeek = plan?.daysPerWeek ?? 0;

			if (previous.selectedWeekdays.includes(weekday)) {
				return {
					...previous,
					selectedWeekdays: previous.selectedWeekdays.filter(
						(day) => day !== weekday
					),
				};
			}

			return {
				...previous,
				selectedWeekdays: [...previous.selectedWeekdays, weekday].slice(
					-daysPerWeek
				),
			};
		});
	}, [plan]);

	return {
		inputs,
		batch,
		plan,
		registrationOption,
		quote,
		isFixedTerm,
		batchWeekdays,
		billedWeekdays,
		setBatchId,
		setPlanId,
		setRegistrationOptionId,
		setStartDate,
		setEndDate,
		toggleWeekday,
	};
};

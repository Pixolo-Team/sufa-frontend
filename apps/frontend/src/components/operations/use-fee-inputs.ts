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
	toDateInputValue,
} from "@/utils/fee-calculator.util";
import { getBatchWeekdays } from "@/utils/operations.util";

type FeeInputsState = {
	batchId: string;
	planId: string;
	registrationOptionId: string;
	startDate: string;
	endDate: string;
};

const buildInitialState = (): FeeInputsState => {
	const today = toDateInputValue(new Date());

	return {
		batchId: "",
		planId: "",
		registrationOptionId: "",
		startDate: today,
		endDate: getDefaultEndDate(today),
	};
};

const getInitialPlanId = (batch: OperationsBatchData | undefined): string =>
	batch?.plans[0]?.id ?? "";

const syncDatesForPlan = (startDate: string, plan: OperationsPlanData | undefined) => ({
	startDate,
	endDate: getDefaultEndDate(startDate, plan?.durationMonths ?? 1),
});

export const useFeeInputs = (
	center: OperationsCenterData | undefined,
	registrationOptions: OperationsRegistrationOptionData[]
) => {
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
				registrationOptions.find(
					(item) => item.id === inputs.registrationOptionId
				),
			[registrationOptions, inputs.registrationOptionId]
		);

	const batchWeekdays = useMemo(
		() => (batch ? getBatchWeekdays(batch) : []),
		[batch]
	);
	const billedWeekdays = useMemo(() => {
		if (!plan) return [];
		if (plan.daysPerWeek >= batchWeekdays.length) return batchWeekdays;

		return batchWeekdays.slice(0, plan.daysPerWeek);
	}, [batchWeekdays, plan]);

	const baseQuote: FeeQuoteData | null = useMemo(() => {
		if (!batch || !plan) return null;

		return calculateFeeQuote({
			startDate: inputs.startDate,
			endDate: inputs.endDate,
			sessionWeekdays: billedWeekdays,
			monthlyPrice: plan.price,
			perSessionPrice: plan.perSessionPrice,
			durationMonths: plan.durationMonths,
		});
	}, [
		batch,
		plan,
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
			const nextRegistrationOptionId = registrationOptions.some(
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
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [center, registrationOptions]);

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

	return {
		inputs,
		batch,
		plan,
		registrationOption,
		quote,
		batchWeekdays,
		billedWeekdays,
		setBatchId,
		setPlanId,
		setRegistrationOptionId,
		setStartDate,
		setEndDate,
	};
};

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
	batch?.plans.find((plan) => plan.daysPerWeek !== 2)?.id ??
	batch?.plans[0]?.id ??
	"";

const syncDatesForPlan = (startDate: string, plan: OperationsPlanData | undefined) => ({
	startDate,
	endDate: getDefaultEndDate(startDate, plan?.durationMonths ?? 1),
});

const getInitialWeekdays = (
	batch: OperationsBatchData | undefined,
	plan: OperationsPlanData | undefined
): number[] => (batch ? getBatchWeekdays(batch).slice(0, plan?.daysPerWeek ?? 0) : []);

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
		if (inputs.selectedWeekdays.length > 0) return inputs.selectedWeekdays;
		if (plan.daysPerWeek >= batchWeekdays.length) return batchWeekdays;

		return batchWeekdays.slice(0, plan.daysPerWeek);
	}, [batchWeekdays, inputs.selectedWeekdays, plan]);

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
			isExactPackage: baseQuote.isExactPackage,
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
			const nextBatchWeekdays = nextBatch ? getBatchWeekdays(nextBatch) : [];

			return {
				...previous,
				batchId: nextBatchId,
				planId: nextPlanId,
				registrationOptionId: nextRegistrationOptionId,
				selectedWeekdays:
					previous.selectedWeekdays.length > 0
						? previous.selectedWeekdays.filter((day) =>
								nextBatchWeekdays.includes(day)
							)
						: getInitialWeekdays(nextBatch, nextPlan),
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
				selectedWeekdays: getInitialWeekdays(nextBatch, nextPlan),
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
				selectedWeekdays: getInitialWeekdays(batch, nextPlan),
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
		setInputs((previous) => {
			if (endDate && previous.startDate && endDate < previous.startDate) {
				return previous;
			}

			return { ...previous, endDate };
		});
	}, []);

	const setDaysPerWeek = useCallback((daysPerWeek: number) => {
		setInputs((previous) => {
			const durationMonths =
				batch?.plans.find((item) => item.id === previous.planId)?.durationMonths ??
				1;
			const nextPlan = batch?.plans.find(
				(item) =>
					item.durationMonths === durationMonths &&
					item.daysPerWeek === daysPerWeek
			);
			const nextDates = syncDatesForPlan(previous.startDate, nextPlan);
			const nextBatchWeekdays = batch ? getBatchWeekdays(batch) : [];

			return {
				...previous,
				planId: nextPlan?.id ?? previous.planId,
				selectedWeekdays: nextBatchWeekdays.slice(0, daysPerWeek),
				startDate: nextDates.startDate,
				endDate: nextDates.endDate,
			};
		});
	}, [batch]);

	const toggleSelectedWeekday = useCallback((day: number) => {
		setInputs((previous) => {
			const currentPlan = batch?.plans.find((item) => item.id === previous.planId);
			const maxDays = currentPlan?.daysPerWeek ?? 0;
			const isSelected = previous.selectedWeekdays.includes(day);
			const nextDays = isSelected
				? previous.selectedWeekdays.filter((item) => item !== day)
				: [...previous.selectedWeekdays, day].sort((left, right) => left - right);

			if (nextDays.length === 0) return previous;
			if (nextDays.length > maxDays) {
				return {
					...previous,
					selectedWeekdays: [...previous.selectedWeekdays.slice(1), day].sort(
						(left, right) => left - right
					),
				};
			}

			return { ...previous, selectedWeekdays: nextDays };
		});
	}, [batch]);

	return {
		inputs,
		batch,
		plan,
		registrationOption,
		quote,
		batchWeekdays,
		billedWeekdays,
		setDaysPerWeek,
		toggleSelectedWeekday,
		setBatchId,
		setPlanId,
		setRegistrationOptionId,
		setStartDate,
		setEndDate,
	};
};

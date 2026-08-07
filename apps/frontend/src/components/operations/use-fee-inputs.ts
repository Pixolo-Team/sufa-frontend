// REACT //
import { useCallback, useMemo, useState } from "react";

// TYPES //
import type {
	FeeQuoteData,
	OperationsCenterData,
	OperationsPlanData,
} from "@/types/operations";

// UTILS //
import {
	calculateFeeQuote,
	getDefaultEndDate,
	getFixedTermEndDate,
	toDateInputValue,
} from "@/utils/fee-calculator.util";
import { formatPlanLabel } from "@/utils/operations.util";

/** Weekday labels indexed by JS day number */
export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type FeeInputsState = {
	batchId: string;
	durationMonths: number;
	daysPerWeek: number;
	selectedWeekdays: number[];
	startDate: string;
	endDate: string;
};

const buildInitialState = (): FeeInputsState => {
	const today = toDateInputValue(new Date());

	return {
		batchId: "",
		durationMonths: 1,
		daysPerWeek: 3,
		selectedWeekdays: [],
		startDate: today,
		endDate: getDefaultEndDate(today),
	};
};

export const useFeeInputs = (center: OperationsCenterData | undefined) => {
	const [inputs, setInputs] = useState<FeeInputsState>(buildInitialState);

	const batch = useMemo(
		() =>
			center?.batches.find((item) => item.id === inputs.batchId) ??
			center?.batches[0],
		[center, inputs.batchId]
	);

	const plan: OperationsPlanData | undefined = useMemo(
		() =>
			center?.plans.find(
				(centerPlan) =>
					centerPlan.durationMonths === inputs.durationMonths &&
					centerPlan.daysPerWeek === inputs.daysPerWeek
			),
		[center, inputs.durationMonths, inputs.daysPerWeek]
	);

	const isFixedTerm = inputs.durationMonths > 1;

	const billedWeekdays = useMemo(() => {
		if (!batch) return [];

		if (inputs.daysPerWeek >= batch.days.length) return batch.days;

		return inputs.selectedWeekdays.length === inputs.daysPerWeek
			? inputs.selectedWeekdays
			: batch.days.slice(0, inputs.daysPerWeek);
	}, [batch, inputs.daysPerWeek, inputs.selectedWeekdays]);

	const quote: FeeQuoteData | null = useMemo(() => {
		if (!center || !plan) return null;

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
		center,
		plan,
		isFixedTerm,
		inputs.startDate,
		inputs.endDate,
		billedWeekdays,
	]);

	const setBatchId = useCallback((batchId: string) => {
		setInputs((previous) => ({ ...previous, batchId, selectedWeekdays: [] }));
	}, []);

	const setStartDate = useCallback((startDate: string) => {
		setInputs((previous) => ({
			...previous,
			startDate,
			endDate:
				previous.durationMonths > 1
					? getFixedTermEndDate(startDate, previous.durationMonths)
					: getDefaultEndDate(startDate),
		}));
	}, []);

	const setEndDate = useCallback((endDate: string) => {
		setInputs((previous) => ({ ...previous, endDate }));
	}, []);

	const setDurationMonths = useCallback((durationMonths: number) => {
		setInputs((previous) => {
			const startDate =
				durationMonths > 1
					? `${previous.startDate.slice(0, 8)}01`
					: previous.startDate;

			return {
				...previous,
				durationMonths,
				startDate,
				endDate:
					durationMonths > 1
						? getFixedTermEndDate(startDate, durationMonths)
						: getDefaultEndDate(startDate),
			};
		});
	}, []);

	const setDaysPerWeek = useCallback((daysPerWeek: number) => {
		setInputs((previous) => ({
			...previous,
			daysPerWeek,
			selectedWeekdays: [],
		}));
	}, []);

	const toggleWeekday = useCallback((weekday: number) => {
		setInputs((previous) => {
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
					-previous.daysPerWeek
				),
			};
		});
	}, []);

	return {
		inputs,
		batch,
		plan,
		quote,
		isFixedTerm,
		billedWeekdays,
		setBatchId,
		setStartDate,
		setEndDate,
		setDurationMonths,
		setDaysPerWeek,
		toggleWeekday,
	};
};

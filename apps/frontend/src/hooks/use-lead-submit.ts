// REACT //
import { useCallback, useRef, useState } from "react";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";
import { createLeadRequest, type CreateLeadInput } from "@/services/api/leads.api.service";

type UseLeadSubmitOptions = {
	onSuccess: () => void;
	successMessage?: string;
	errorMessage?: string;
};

/** Shared submit flow for lead-capture forms - insert, toast, reset. Each form keeps its own field validation. */
export const useLeadSubmit = ({
	onSuccess,
	successMessage = "Lead added",
	errorMessage = "Could not add lead. Try again.",
}: UseLeadSubmitOptions) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	// Ref, not state - so the reentrancy guard reads the latest value
	// synchronously instead of a stale closure from the last render.
	const isSubmittingRef = useRef(false);

	const submitLead = useCallback(
		(input: CreateLeadInput) => {
			if (isSubmittingRef.current) return;

			isSubmittingRef.current = true;
			setIsSubmitting(true);

			createLeadRequest(input)
				.then(() => {
					showToast(successMessage, ToastTypes.SUCCESS);
					onSuccess();
				})
				.catch((error: unknown) => {
					// Log the real (possibly DB-internal) error for debugging, but
					// never show raw Postgres/RLS text to the user - EnquiryForm is
					// public-facing.
					console.error("Failed to create lead:", error);
					showToast(errorMessage, ToastTypes.ERROR);
				})
				.finally(() => {
					isSubmittingRef.current = false;
					setIsSubmitting(false);
				});
		},
		[onSuccess, successMessage, errorMessage]
	);

	return { submitLead, isSubmitting };
};

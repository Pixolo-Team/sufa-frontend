// REACT //
import { useEffect, useState } from "react";

// TYPES //
import type { DropdownOptionData } from "@/neevo/types/forms";

// SERVICES //
import { getCentersRequest } from "@/services/api/centers.api.service";

/**
 * Loads the tenant's training centers once and exposes them as dropdown options.
 * The option label is the center's location (what the user reads); the option
 * value is the center id (what gets sent to the leads API as `centerId`).
 */
export const useCenters = () => {
	const [options, setOptions] = useState<DropdownOptionData[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Guard against setting state after the form island unmounts mid-fetch.
		let ignore = false;

		getCentersRequest()
			.then((centers) => {
				if (ignore) return;
				setOptions(
					centers.map((center) => ({
						label: center.location,
						value: center.id,
					}))
				);
			})
			.catch(() => {
				if (!ignore) setError("Could not load venues");
			})
			.finally(() => {
				if (!ignore) setIsLoading(false);
			});

		return () => {
			ignore = true;
		};
	}, []);

	return { options, isLoading, error };
};

import { Colors, Status } from "@/neevo/enums/core.enum";

/**  Function to convert Status value to Color value */
export const getColorFromStatus = (status: Status) => {
	if (status == Status.ERROR) {
		return Colors.ERROR;
	}
	if (status == Status.SUCCESS) {
		return Colors.SUCCESS;
	}
	if (status == Status.WARNING) {
		return Colors.WARNING;
	}
};

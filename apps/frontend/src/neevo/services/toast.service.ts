// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";

/** This function shows the toast for 3 seconds. Type of toast is also a Parameter (Message, Error or Warning) */
export const showToast = (message: string, type: ToastTypes) => {
	// Create a new toast element
	const toastElement = document.createElement("div");
	toastElement.className = `toast ${type}`;
	toastElement.innerHTML = `<p>${message}</p>`;

	// Append the toast element to the body
	document.body.appendChild(toastElement);

	// Fade out, then remove once the exit transition finishes
	setTimeout(() => {
		toastElement.classList.add("toast-exit");
		setTimeout(() => toastElement.remove(), 250);
	}, 3000); // 3000 milliseconds (3 seconds)
};

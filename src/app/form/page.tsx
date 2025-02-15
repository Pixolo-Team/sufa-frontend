"use client";
// REACT //
import { useState } from "react";

// ENUMS //
import { ToastTypes } from "@/neevo/enums/toast.enum";

// COMPONENTS //
import InputBox from "@/neevo/components/input-box/InputBox";
import Button from "@/neevo/components/button/Button";

// API SERVICES //
import { createLeadRequest } from "@/services/api/privyr.api.service";

// SERVICES //
import { showToast } from "@/neevo/services/toast.service";

const FormPage: React.FC<unknown> = () => {
	const [inputValues, setInputValues] = useState({
		name: "",
		email: "",
		others: {
			Gender: "Male",
		},
	});

	/** Submit form */
	const submitForm = () => {
		createLeadRequest(inputValues)
			.then((response) => {
				if (response.success) {
					showToast("Lead created successfully", ToastTypes.SUCCESS);
					// Empty the form
					setInputValues({
						name: "",
						email: "",
						others: {
							Gender: "Male",
						},
					});
				} else {
					showToast("Failed to create lead", ToastTypes.ERROR);
				}
			})
			.catch(() => {
				showToast("Failed to create lead", ToastTypes.ERROR);
			});
	};

	return (
		<div>
			<InputBox
				label="Name"
				placeholder="Enter your name"
				value={inputValues.name}
				isError={false}
				onChange={(value) =>
					setInputValues({
						...inputValues,
						name: value,
					})
				}
				errorMessage="Name is required"
				onClear={() =>
					setInputValues({
						...inputValues,
						name: "",
					})
				}
			></InputBox>
			<InputBox
				label="Email"
				placeholder="Enter your email"
				value={inputValues.email}
				isError={false}
				onChange={(value) =>
					setInputValues({
						...inputValues,
						email: value,
					})
				}
				errorMessage="Email is required"
				onClear={() =>
					setInputValues({
						...inputValues,
						email: "",
					})
				}
			></InputBox>

			<Button onClick={submitForm} text="Submit"></Button>
		</div>
	);
};

export default FormPage;

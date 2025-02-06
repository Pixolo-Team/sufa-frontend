// REACT //
import React from "react";

// ENUMS //
import { ErrorCodes } from "@/neevo/enums/error.enum";

// STYLES //

// COMPONENTS //
import PageError from "@/components/page-error/PageError";

/** Not found Screen */
const NotFound: React.FC = () => {
	return (
		<PageError
			errorCode={ErrorCodes.NOT_FOUND}
			errorTitle="Opps... This page was not found."
			errorDescription="Not all who wander are lost. Unfortunately, in this case it look like you are.This page does not seem to exist. Don’t feel bad, let us help you help you get back on your way!"
		/>
	);
};

export default NotFound;

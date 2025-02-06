/** Formats the file size and returns a readable File Size */
export const formatFileSize = (size: number) => {
	// Measure KB and MB
	const kb = size / 1024;
	const mb = kb / 1024;
	// If size is greater than 1 MB, return in MB's
	if (mb > 1) {
		return `${mb.toFixed(2)} MB`;
	}
	// Else return in KB's
	return `${kb.toFixed(2)} KB`;
};

/** Gets the simplified File Type string */
export const getSimplifiedFileType = (file: File) => {
	// Check if the file is an image
	if (file.type.startsWith("image/")) {
		return file.type.split("/")[1];
	} else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
		// Check if the file is a PDF
		return "pdf";
	} else if (
		// Check if the file is an Excel document
		file.type === "application/vnd.ms-excel" ||
		file.type ===
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
		file.name.endsWith(".xls") ||
		file.name.endsWith(".xlsx")
	) {
		return "xlsx";
	} else {
		// Return the file type
		return file.type.split("/")[1] || "file";
	}
};

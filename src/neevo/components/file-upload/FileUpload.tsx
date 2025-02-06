"use client";
// REACT //
import React, { useRef, useState } from "react";

// ENUMS //
import { FileUploadLevels } from "@/neevo/enums/upload-file.enum";

// STYLES //
import styles from "@/neevo/components/file-upload/file-upload.module.scss";
import "@/../public/styles/globals.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";
import Image from "next/image";
import Link from "next/link";

// UTILS //
import { formatFileSize, getSimplifiedFileType } from "@/neevo/utils/file.util";

interface FileUploadProps {
	files: File[];
	onFilesChange: (filePaths: string[], files: File[]) => void;
	multiple?: boolean;
	acceptedFiles?: string[];
	label?: string;
	uploadMessage?: string;
	isError: boolean;
	errorMessage: string;
	level?: FileUploadLevels;
}

/** Neevo File Upload Component */
const FileUpload: React.FC<FileUploadProps> = ({
	files,
	onFilesChange,
	multiple = true,
	acceptedFiles = [".jpg", ".png", ".pdf"],
	label = "Upload File",
	uploadMessage = "",
	isError = false,
	errorMessage = "",
	level = FileUploadLevels.FIXED,
}) => {
	// Define States
	const [isDragActive, setIsDragActive] = useState<boolean>(false);

	// Define Refs
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// Helper Functions

	/** Event handler for when a draggable item enters the drop zone */
	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragActive(true);
	};

	/** Event handler for when a draggable item leaves the drop zone */
	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		// Check if the drag leaves the drop zone or if it is leaving the children
		if (event.currentTarget === event.target) {
			setIsDragActive(false);
		}
	};

	/** Handles the file input change event */
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// Get the selected files from the input element
		const selectedFiles = event.target.files;

		// Check if any files are selected
		if (selectedFiles) {
			if (multiple) {
				const newFiles = [...files, ...Array.from(selectedFiles)];

				onFilesChange(
					newFiles.map((file) => URL.createObjectURL(file)),
					newFiles
				);
			} else {
				const newFiles = [selectedFiles[0]];

				onFilesChange(
					newFiles.map((file) => URL.createObjectURL(file)),
					newFiles
				);
			}
		}
		// Reset the file input to allow selecting the same file again
		event.target.value = "";
	};

	/** Handles the drop event */
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();

		// Get the dropped files from the event data transfer
		const droppedFiles = event.dataTransfer.files;

		// Check if any files are dropped, and set them in the State
		if (droppedFiles) {
			// Check if multiple files are allowed, then add it to the existing files array.
			if (multiple) {
				// Add the dropped files to the existing files array
				const newFiles = [...files, ...Array.from(droppedFiles)];

				// Call the onFilesChange callback with the new file paths
				onFilesChange(
					newFiles.map((file) => URL.createObjectURL(file)),
					newFiles
				);
			} else if (files.length === 0) {
				// If multiple files are not allowed, then only add the first file to the files array.
				const newFiles = [droppedFiles[0]];

				// Call the onFilesChange callback with the new file paths
				onFilesChange(
					newFiles.map((file) => URL.createObjectURL(file)),
					newFiles
				);
			}
		}
		// Reset isDragActive state after drop
		setIsDragActive(false);
	};

	/** Handles the drag over event */
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		// Only handle the drag over event if no file has been uploaded
		if (files.length === 0) {
			setIsDragActive(true);
		}
	};

	/** Opens the file input dialog when the drop zone is clicked */
	const handleClick = (
		event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
	) => {
		event.preventDefault();
		if (multiple || files.length === 0) {
			fileInputRef.current?.click();
		}
	};

	/** Removes a file from the list of uploaded files */
	const handleRemoveFile = (
		index: number,
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.stopPropagation();

		// Filter out the file at the specified index
		const newFiles = files.filter((_, i) => i !== index);

		// Call the onFilesChange callback with the new file paths
		onFilesChange(
			newFiles.map((file) => URL.createObjectURL(file)),
			newFiles
		);
	};

	/** Renders a preview of the uploaded file */
	const renderFilePreview = (file: File): JSX.Element => {
		// Create an object URL for the file
		const url = URL.createObjectURL(file);

		// Check if the file is an image
		if (file.type.startsWith("image/")) {
			// Render an image element if the file is an image
			return (
				<Image
					src={url}
					alt={file.name}
					className={styles.filePreviewImage}
					height={92}
					width={92}
				/>
			);
		} else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
			// Render a PDF icon if the file is a PDF
			return <Icon iconName="pdf" className={styles.fileIcon} />;
		} else if (
			file.type === "application/vnd.ms-excel" ||
			file.type ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
			file.name.endsWith(".xls") ||
			file.name.endsWith(".xlsx")
		) {
			// Render an Excel icon if the file is an Excel document
			return <Icon iconName="excel" className={styles.fileIcon} />;
		} else {
			// Render a generic file icon for all other file types
			return <Icon iconName="file" className={styles.fileIcon} />;
		}
	};

	/** Formats the accepted files array to include a dot before each file extension */
	const formatAcceptedFiles = (acceptedFiles: string[]) => {
		return acceptedFiles.map((file) => {
			// Check if the file pattern starts with '/*'
			if (file.includes("/")) {
				return file; // No modification needed
			}
			// Add a dot if not already present
			return file.startsWith(".") ? file : `.${file}`;
		});
	};

	// UseEffect and UseRef

	return (
		<div
			className={`${styles.uploadFile} ${
				level === FileUploadLevels.FIXED ? styles.inlineUploadContainer : ""
			} `}
		>
			{/* Upload File - Label */}
			<p className={styles.uploadFileTitle}>{label}</p>

			<div
				className={`${styles.dropZone} mobileHide ${
					isDragActive ? styles.dropActive : ""
				} ${files.length === 1 && multiple == false ? styles.dropDisabled : ""}${
					isError ? styles.uploadError : ""
				}`}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
			>
				{/* Empty State */}
				{/* Render the empty state if multiple is true or no files are uploaded */}
				{(multiple || files.length === 0) && (
					<Link
						href={""}
						className={styles.uploadFileEmptyState}
						onClick={(event) => handleClick(event)}
					>
						<div className={styles.uploadFileDescription}>
							<Icon iconName="upload-tray" className={styles.uploadIcon} />

							{/* Drag Text */}
							<p className={styles.dragText}>Click or drag and drop the file here</p>

							{/* Accepted Files */}
							<p className={styles.acceptedFiles}>
								Accepted Files: {acceptedFiles.join(", ")}
							</p>
						</div>

						{/* Upload Description Text */}
						<p className={styles.uploadDescriptionText}>{uploadMessage}</p>
					</Link>
				)}

				{/* -- Desktop UI For Single Upload Starts Here --- */}
				{files.length === 1 && !multiple && (
					<div className={styles.singleUpload}>
						<div className={styles.uploadPreviewWrap}>
							<div className={styles.uploadPreview}>
								{renderFilePreview(files[0])}

								{/* Remove File Button */}
								<button
									onClick={(event) => handleRemoveFile(0, event)}
									className={styles.removeSingleFile}
								>
									<Icon iconName="close" className={styles.removeSingleFileIcon} />
								</button>
							</div>

							{/* File Name */}
							<p className={styles.singleFileName}>
								<span className={styles.singleFileText}>File: </span>
								{files[0].name}
							</p>
						</div>

						{/* File Info */}
						<div className={styles.uploadChecked}>
							<Icon iconName="check" className={styles.checkIcon} />
							<p className={styles.singleFileUploadedText}>File Uploaded</p>
						</div>
					</div>
				)}
				{/* --- Desktop UI For Single Upload Ends Here --- */}

				{/* --- Desktop UI For Multiple Files Uploaded Starts Here --- */}
				{files.length > 0 && multiple && (
					<div className={styles.multipleUpload}>
						<p className={styles.multipleUploadTitle}>Uploaded Files</p>
						<div className={styles.multipleUploadWrap}>
							{/* For loop for multiple files */}
							{files.map((fileItem, fileIndex) => (
								<div
									key={`${fileItem.name}-${fileIndex}`}
									className={styles.multipleUploadPreviewWrap}
								>
									<div className={styles.multipleFileInfoWrap}>
										{/* File Preview */}
										<div className={styles.multipleUploadPreview}>
											{renderFilePreview(fileItem)}
										</div>
										<div>
											{/* File Name */}
											<p className={styles.fileName}>{fileItem.name}</p>

											{/* File Type and File Size */}
											<p className={styles.fileInfo}>
												{getSimplifiedFileType(fileItem)}
												<span className={styles.fileSize}>
													{formatFileSize(fileItem.size)}
												</span>
											</p>
										</div>
									</div>

									{/* Remove File Button */}
									<button
										onClick={(event) => handleRemoveFile(fileIndex, event)}
										className={styles.removeMultipleFile}
									>
										<Icon iconName="close" className={styles.removeMultipleFileIcon} />
									</button>
								</div>
							))}
						</div>
					</div>
				)}
				{/* --- Desktop UI For Multiple Files Uploaded Ends Here --- */}
			</div>

			{/* --- Mobile UI For Single & Multiple Files Uploaded Starts Here --- */}
			<div
				className={`${styles.mobileUploadFileWrap} ${
					isError ? styles.uploadError : ""
				} desktopHide`}
			>
				{/* Browse File Button */}
				<Link
					href=""
					onClick={(event) => handleClick(event)}
					className={`${styles.mobileUploadFile} ${
						files.length >= 1 && !multiple ? styles.mobileDisabled : ""
					}`}
				>
					<Icon iconName="upload-tray" className={styles.uploadIconMobile} />

					{/* Drag Text */}
					<p className={styles.mobileUploadFileTitle}>Browse File</p>
				</Link>

				{/* Accepted Files */}
				<p className={styles.mobileUploadFileType}>
					Accepted Files: {acceptedFiles.join(", ")}
				</p>

				{/* Upload Description Text */}
				{uploadMessage.trim() !== "" && files.length === 0 && (
					<p className={styles.mobileUploadFileDescription}>{uploadMessage}</p>
				)}

				{/* Uploaded File Preview - Mobile Screen */}
				{files.length > 0 && (
					<div>
						{/* For loop for multiple files */}
						{files.map((fileItem, fileIndex) => (
							<div
								className={styles.mobileUploadedFileItem}
								key={`${fileItem.name}-${fileIndex}-mobile`}
							>
								<div className={styles.mobileUploadedFileInfo}>
									{/* File Preview - Icon / Image*/}
									{renderFilePreview(fileItem)}
									<div className={styles.mobileUploadedContent}>
										{/* File Name */}
										<p className={styles.uploadedFileName}>{fileItem.name}</p>

										{/* File Size */}
										<p className={styles.uploadedFileSize}>
											{formatFileSize(fileItem.size)}
										</p>
									</div>
								</div>

								{/* Remove File Button */}
								<button
									onClick={(event) => handleRemoveFile(fileIndex, event)}
									className={styles.mobileRemoveMultipleFile}
								>
									<Icon
										iconName="delete"
										className={styles.mobileRemoveMultipleFileIcon}
									/>
								</button>
							</div>
						))}
					</div>
				)}
			</div>
			{/* --- Mobile UI For Single & Multiple Files Uploaded Ends Here --- */}

			{/* File Input */}
			<input
				type="file"
				ref={fileInputRef}
				className={styles.fileInput}
				style={{ display: "none" }}
				onChange={handleFileChange}
				multiple={multiple}
				accept={formatAcceptedFiles(acceptedFiles).join(", ")}
			/>
			{/* Error Message */}
			{errorMessage && isError && (
				<p className={styles.errorMessage}>{errorMessage}</p>
			)}
		</div>
	);
};

export default FileUpload;

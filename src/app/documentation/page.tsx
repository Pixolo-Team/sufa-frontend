"use client";

// REACT //
import { useState } from "react";

// TYPES //
import { DropdownOptionData } from "@/neevo/types/forms";

// ENUMS //
import { Colors, Shapes, Sizes, Variants } from "@/neevo/enums/core.enum";
import { AvatarSizes } from "@/neevo/enums/avatar.enum";
import { ButtonLevels, ButtonSizes } from "@/neevo/enums/button.enum";
import { PaginationColors } from "@/neevo/enums/pagination.enum";
import { FileUploadLevels } from "@/neevo/enums/upload-file.enum";
import { BadgeTextTypes } from "@/neevo/enums/badge.enum";

// STYLES //
import styles from "@/app/documentation/documentation.module.css";

// COMPONENTS //
import Alert from "@/neevo/components/alert/Alert";
import Avatar from "@/neevo/components/avatar/Avatar";
import Badge from "@/neevo/components/badge/Badge";
import Button from "@/neevo/components/button/Button";
import Checkbox from "@/neevo/components/checkbox/Checkbox";
import FileUpload from "@/neevo/components/file-upload/FileUpload";
import IconButton from "@/neevo/components/icon-button/IconButton";
import InputBox from "@/neevo/components/input-box/InputBox";
import Pagination from "@/neevo/components/pagination/Pagination";
import Popup from "@/neevo/components/popup/Popup";
import Radio from "@/neevo/components/radio/Radio";
import Searchbar from "@/neevo/components/searchbar/Searchbar";
import Select from "@/neevo/components/select/Select";
import TextArea from "@/neevo/components/text-area/TextArea";
import Tooltip from "@/neevo/components/tooltip/Tooltip";
import Switch from "@/neevo/components/switch/Switch";
import Skeleton from "@/neevo/components/skeleton/Skeleton";
import Chip from "@/neevo/components/chip/Chip";

/** Documentation Screen */
const DocumentationScreen: React.FC<unknown> = () => {
	// Define States
	const selectOptions: DropdownOptionData[] = [
		{ label: "PDF", value: "pdf", iconName: "pdf" },
		{ label: "FILE", value: "file", iconName: "file" },
	];
	const [selectValue, setSelectValue] = useState<string>("");
	const [inputValue, setInputValue] = useState<string>("");
	const [textareaValue, setTextareaValue] = useState<string>("");
	const [checkboxValue, setCheckboxValue] = useState<boolean>(true);
	const [radioValue, setRadioValue] = useState<string>("");
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [switchValue, setSwitchValue] = useState<boolean>(false);
	const [files, setFiles] = useState<File[]>([]);

	// Define Refs

	// Helper Functions
	/** Get selected option */
	const getSelectedOption = () => {
		const option = selectOptions.filter((option) => option.value === selectValue);
		return option[0];
	};

	// UseEffect and UseRef

	// View starts here
	return (
		<main className="container">
			<div className={styles.mainContainer}>
				{/* Chip Component */}
				<div
					className={styles.componentContainer}
					style={{
						alignItems: "flex-start",
					}}
				>
					<h4>Chip Component</h4>
					<Chip
						text="Chip"
						onCloseClick={() => console.log("close")}
						leftIcon="file"
						showClose={true}
						variant={Variants.SOLID}
						color={Colors.PRIMARY}
						size={Sizes.MEDIUM}
						shape={Shapes.DEFAULT}
						isEllipses={true}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Alert Component</h4>
					<Alert
						title="Title Text"
						description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt quis nam reprehenderit adipisci doloribus quidem dolorem vel quia! Rerum, impedit."
						buttonOneText="Accept"
						buttonTwoText="Reject"
						showClose={true}
						leftIcon="users"
						color={Colors.PRIMARY}
						variant={Variants.OUTLINE}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Skeleton Component</h4>
					<Skeleton height="100px"></Skeleton>
				</div>

				<div className={styles.componentContainer}>
					<h4>Avatar Component</h4>
					<Avatar
						color={Colors.PRIMARY}
						size={AvatarSizes.LARGE}
						shape={Shapes.ROUNDED}
					/>
				</div>
				<div className={styles.componentContainer}>
					<h4>Button Component</h4>
					<Button
						text="text"
						onClick={() => console.log("clicked")}
						leftIcon="logout"
						rightIcon="graph-bar"
						size={ButtonSizes.SMALL}
					/>
				</div>
				<div className={styles.componentContainer}>
					<h4>Badge Component</h4>
					<Badge
						type={BadgeTextTypes.NUMBER}
						text="93213"
						maxLength={3}
						size={Sizes.MEDIUM}
						color={Colors.PRIMARY}
						showDot={false}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Icon Button Component</h4>
					<IconButton
						icon="users"
						size={Sizes.MEDIUM}
						isDisabled
						onClick={() => {
							console.log("IconButton clicked");
						}}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Radio Component</h4>
					<Radio
						label="True"
						onChange={(value) => {
							setRadioValue(value);
						}}
						value={"abc"}
						isChecked={radioValue === "abc"}
						isDisabled={false}
					/>
					<Radio
						label="False"
						onChange={(value) => {
							setRadioValue(value);
						}}
						value={"xyz"}
						isChecked={radioValue === "xyz"}
						isDisabled={true}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Searchbar Component</h4>

					<Searchbar
						label="Search file type"
						onTextChange={(value) => {
							console.log(value);
						}}
						placeholder="Search here"
						options={[
							{ label: "PDF", value: "pdf", iconName: "pdf" },
							{ label: "FILE", value: "file", iconName: "file" },
						]}
						size={Sizes.LARGE}
					/>
				</div>
				<div className={styles.componentContainer}>
					<h4>Select Component</h4>
					<Select
						label="File type"
						onChange={(option) => {
							setSelectValue(option.value);
						}}
						leftIcon="users"
						options={selectOptions}
						selectedOption={getSelectedOption()}
						size={Sizes.LARGE}
					/>
				</div>
				<div className={styles.componentContainer}>
					<h4>InputBox Component</h4>
					<InputBox
						onChange={(value) => setInputValue(value)}
						errorMessage="Error Message"
						isError={false}
						onClear={() => setInputValue("")}
						label="Name"
						value={inputValue}
						placeholder="Enter Name"
						iconRight="users"
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Switch Component</h4>
					<Switch
						onChange={(checked) => {
							setSwitchValue(checked);
						}}
						isChecked={switchValue}
						size={Sizes.LARGE}
						shape={Shapes.DEFAULT}
						color={Colors.PRIMARY}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>TextArea Component</h4>
					<TextArea
						label="Message"
						placeholder="Tell me more"
						onClear={() => {
							setTextareaValue("");
						}}
						isError={false}
						errorMessage={""}
						onChange={(value) => {
							setTextareaValue(value);
						}}
						value={textareaValue}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>FileUpload Component</h4>
					<FileUpload
						files={files}
						onFilesChange={(filePaths, files) => {
							setFiles(files);
						}}
						acceptedFiles={["image/*"]}
						isError={false}
						errorMessage="Error Message"
						multiple={true}
						level={FileUploadLevels.BLOCK}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Checkbox Component</h4>
					<Checkbox
						label="Accept terms and conditions"
						onChange={(value) => setCheckboxValue(value)}
						isChecked={checkboxValue}
					/>
				</div>

				<div className={styles.componentContainer}>
					<h4>Tooltip Component</h4>
					<div className={styles.buttonTooltip}>
						<Button
							level={ButtonLevels.INLINE}
							text="Click ME!"
							onClick={() => console.log("click")}
						/>
						<Tooltip
							position="right"
							onCloseClick={() => {
								console.log("close");
							}}
							title="Title Text"
							message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus necessitatibus accusamus labore id voluptates molestias itaque. Assumenda error ipsa perspiciatis."
						/>
					</div>
				</div>

				<div className={styles.componentContainer}>
					<h4>Popup Component</h4>
					{/* <div> */}
					<Button
						level={ButtonLevels.INLINE}
						text="Show popover"
						onClick={() => setShowPopover(true)}
					/>
					{/* </div> */}
					{showPopover && (
						<Popup
							title="Title text"
							description="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate enim doloremque iure harum expedita dolore possimus assumenda quibusdam. Maxime, reiciendis."
							onCloseClick={() => setShowPopover(false)}
							onOverlayClick={() => setShowPopover(false)}
						/>
					)}
				</div>

				<div className={styles.componentContainer}>
					<h4>Pagination Component</h4>
					<Pagination
						totalPages={10}
						url=""
						variant={Variants.SOLID}
						color={PaginationColors.SECONDARY}
					/>
				</div>
			</div>
		</main>
	);
};

export default DocumentationScreen;

// REACT //
import React, { useEffect, useRef, useState } from "react";

// STYLES //
import styles from "./accordian.module.scss";

// COMPONENTS //
import Icon from "@/neevo/components/Icon";

interface AccordianProps {
	title: string;
	description: string;
	isOpen: boolean;
	onToggle: () => void;
}

/** Accordian Component */
const Accordian: React.FC<AccordianProps> = ({
	title,
	description,
	isOpen = false,
	onToggle,
}) => {
	// Navigation and Route Params

	// Define States
	const [answerHeight, setAnswerHeight] = useState<number>(0);

	// Define Refs
	const answerRef = useRef<HTMLDivElement>(null);

	// Helper Functions

	// UseEffect Functions and UseFocusEffect Functions
	useEffect(() => {
		if (answerRef.current) {
			setAnswerHeight(isOpen ? answerRef.current.scrollHeight : 0);
		}
	}, [isOpen]);

	// View starts here
	return (
		<div className={`${styles.accordianItem} ${isOpen && styles.active}`}>
			<div
				className={`${styles.questionWrapper} flex align-center justify-between`}
				onClick={onToggle}
			>
				{/* Title */}
				<p className={`${styles.title} font-weight-500`}>{title}</p>
				<button
					className={`${styles.iconWrapper} flex align-center justify-center`}
				>
					{/* Icon */}
					<Icon
						iconName={isOpen ? "minus" : "plus"}
						className={styles.icon}
						mode="outline"
					/>
				</button>
			</div>
			<div
				className={styles.answerWrapper}
				ref={answerRef}
				style={{
					height: `${answerHeight}px`,
				}}
			>
				{/* Description */}
				<p className={`${styles.description} font-weight-400`}>{description}</p>
			</div>
		</div>
	);
};

export default Accordian;

// STYLES //
import styles from "@/neevo/components/skeleton/skeleton.module.scss";

interface SkeletonProps {
	width?: string;
	height?: string;
	borderRadius?: string;
}

/** Skeleton Component */
const Skeleton: React.FC<SkeletonProps> = ({
	width = "100%",
	height = "100%",
	borderRadius = "10px",
}) => {
	return (
		<div
			className={styles.skeleton}
			style={{
				width,
				height,
				borderRadius,
			}}
		/>
	);
};

export default Skeleton;

// SVG's //
import ArrowFilled from "@/../public/icons/filled/arrow.svg";
import BoxMenuFilled from "@/../public/icons/filled/box-menu.svg";
import CloseFilled from "@/../public/icons/filled/close.svg";
import CheckFilled from "@/../public/icons/filled/check.svg";
import CuteFilled from "@/../public/icons/filled/cute.svg";
import DiscFilled from "@/../public/icons/filled/disc.svg";
import ExclamationFilled from "@/../public/icons/filled/exclamation.svg";
import DownArrowFilled from "@/../public/icons/filled/down-arrow.svg";
import EyeFilled from "@/../public/icons/filled/eye.svg";
import FileFilled from "@/../public/icons/filled/file.svg";
import GraphBarFilled from "@/../public/icons/filled/graph-bar.svg";
import HamburgerFilled from "@/../public/icons/filled/hamburger.svg";
import InfoFilled from "@/../public/icons/filled/info.svg";
import LogoutFilled from "@/../public/icons/filled/logout.svg";
import MailOpenFilled from "@/../public/icons/filled/mail-open.svg";
import MoreOptionsFilled from "@/../public/icons/filled/more-options.svg";
import PlusFilled from "@/../public/icons/filled/plus.svg";
import RightArrowFilled from "@/../public/icons/filled/right-arrow.svg";
import SearchFilled from "@/../public/icons/filled/search.svg";
import LinkArrowFilled from "@/../public/icons/filled/link-arrow.svg";
import UserCircleFilled from "@/../public/icons/filled/user-circle.svg";
import UsersFilled from "@/../public/icons/filled/users.svg";
import VerfiedFilled from "@/../public/icons/filled/verified.svg";
import PdfFilled from "@/../public/icons/filled/pdf.svg";
import UploadTrayFilled from "@/../public/icons/filled/upload-tray.svg";
import InvisibleFilled from "@/../public/icons/filled/invisible.svg";
import DeleteFilled from "@/../public/icons/filled/delete.svg";
import NotFoundFilled from "@/../public/icons/filled/404.svg";
import BadRequestFilled from "@/../public/icons/filled/400.svg";
import InternalServerErrorFilled from "@/../public/icons/filled/500.svg";
import QuoteFilled from "@/../public/icons/filled/quote.svg";

import ArrowOutline from "@/../public/icons/outline/arrow.svg";
import BoxMenuOutline from "@/../public/icons/outline/box-menu.svg";
import CloseOutline from "@/../public/icons/outline/close.svg";
import CheckOutline from "@/../public/icons/outline/check.svg";
import DiscOutline from "@/../public/icons/outline/disc.svg";
import ExclamationOutline from "@/../public/icons/outline/exclamation.svg";
import DownArrowOutline from "@/../public/icons/outline/down-arrow.svg";
import EyeOutline from "@/../public/icons/outline/eye.svg";
import FileOutline from "@/../public/icons/outline/file.svg";
import GraphBarOutline from "@/../public/icons/outline/graph-bar.svg";
import HamburgerOutline from "@/../public/icons/outline/hamburger.svg";
import InfoOutline from "@/../public/icons/outline/info.svg";
import LogoutOutline from "@/../public/icons/outline/logout.svg";
import MailOpenOutline from "@/../public/icons/outline/mail-open.svg";
import MoreOptionsOutline from "@/../public/icons/outline/more-options.svg";
import RightArrowOutline from "@/../public/icons/outline/right-arrow.svg";
import SearchOutline from "@/../public/icons/outline/search.svg";
import SearchOptionOutline from "@/../public/icons/outline/search-option.svg";
import UserCircleOutline from "@/../public/icons/outline/user-circle.svg";
import UsersOutline from "@/../public/icons/outline/users.svg";
import VerifiedOutline from "@/../public/icons/outline/verified.svg";
import PdfOutline from "@/../public/icons/outline/pdf.svg";
import UploadTrayOutline from "@/../public/icons/outline/upload-tray.svg";
import InvisibleOutline from "@/../public/icons/outline/invisible.svg";
import DeleteOutline from "@/../public/icons/outline/delete.svg";
import PlusOutline from "@/../public/icons/outline/plus.svg";
import MinusOutline from "@/../public/icons/outline/minus.svg";
import InstagramOutline from "@/../public/icons/outline/instagram.svg";

//TODO : Add SearchOptionFilled

// Define the mapping of component names to components
const filled: {
	[key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
	arrow: ArrowFilled,
	"box-menu": BoxMenuFilled,
	close: CloseFilled,
	check: CheckFilled,
	cute: CuteFilled,
	disc: DiscFilled,
	exclamation: ExclamationFilled,
	"down-arrow": DownArrowFilled,
	eye: EyeFilled,
	file: FileFilled,
	"graph-bar": GraphBarFilled,
	hamburger: HamburgerFilled,
	info: InfoFilled,
	logout: LogoutFilled,
	"link-arrow": LinkArrowFilled,
	"mail-open": MailOpenFilled,
	"more-options": MoreOptionsFilled,
	plus: PlusFilled,
	"right-arrow": RightArrowFilled,
	search: SearchFilled,
	"user-circle": UserCircleFilled,
	users: UsersFilled,
	verified: VerfiedFilled,
	pdf: PdfFilled,
	"upload-tray": UploadTrayFilled,
	invisible: InvisibleFilled,
	delete: DeleteFilled,
	"not-found": NotFoundFilled,
	"bad-request": BadRequestFilled,
	"internal-server-error": InternalServerErrorFilled,
	quote: QuoteFilled,
};

const outline: {
	[key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
	arrow: ArrowOutline,
	"box-menu": BoxMenuOutline,
	close: CloseOutline,
	check: CheckOutline,
	disc: DiscOutline,
	exclamation: ExclamationOutline,
	"down-arrow": DownArrowOutline,
	eye: EyeOutline,
	file: FileOutline,
	"graph-bar": GraphBarOutline,
	hamburger: HamburgerOutline,
	info: InfoOutline,
	logout: LogoutOutline,
	"mail-open": MailOpenOutline,
	"more-options": MoreOptionsOutline,
	plus: PlusOutline,
	"right-arrow": RightArrowOutline,
	search: SearchOutline,
	"search-option": SearchOptionOutline,
	"user-circle": UserCircleOutline,
	users: UsersOutline,
	verified: VerifiedOutline,
	pdf: PdfOutline,
	"upload-tray": UploadTrayOutline,
	invisible: InvisibleOutline,
	delete: DeleteOutline,
	instagram: InstagramOutline,
	minus: MinusOutline,
};

const iconMap: {
	filled: {
		[key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	};
	outline: {
		[key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
	};
} = {
	filled: filled,
	outline: outline,
};

// Interface for Icon Props.
interface IconProps {
	iconName: string;
	className: string;
	mode?: "filled" | "outline";
}

/** Icon Component */
const Icon: React.FC<IconProps> = ({
	iconName,
	className,
	mode = "outline",
}) => {
	// Check if the component name exists in the mapping
	const IconComponent = iconMap[mode][iconName];

	if (!IconComponent) {
		// Render a placeholder or an error message for unknown component names
		return <div>Unknown component: {iconName}</div>;
	}

	// Render the dynamically resolved component
	return <IconComponent className={className} viewBox={"0 0 20 20"} />;
};

export default Icon;

// REACT //
import { useEffect, useState } from "react";

// ENUMS //
import { Themes } from "../enums/theme.enum";

// STYLES //
import { useTheme } from "next-themes";

// COMPONENTS //
import Switch from "@/neevo/components/switch/Switch";

/** Theme Switcher Component */
const ThemeSwitcher = () => {
	// Define States
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState<boolean>(false);

	// Ensures that theme switching works only on the client side
	useEffect(() => setMounted(true), []);

	// Check if mounted
	if (!mounted) return null;

	return (
		<Switch
			isChecked={theme === Themes.DARK}
			onChange={() => setTheme(theme === Themes.DARK ? Themes.LIGHT : Themes.DARK)}
		/>
	);
};

export default ThemeSwitcher;

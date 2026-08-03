// ENUMS //
import { Themes } from "@/neevo/enums/theme.enum";

const STORAGE_KEY = "theme";

/** Reads the persisted theme, falling back to the operating system preference */
export const getStoredTheme = (): Themes => {
	const storedTheme = localStorage.getItem(STORAGE_KEY);

	if (storedTheme === Themes.DARK || storedTheme === Themes.LIGHT) {
		return storedTheme;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? Themes.DARK
		: Themes.LIGHT;
};

/** Persists the theme and reflects it as a class on the <html> element */
export const applyTheme = (theme: Themes): void => {
	localStorage.setItem(STORAGE_KEY, theme);

	document.documentElement.classList.remove(Themes.LIGHT, Themes.DARK);
	document.documentElement.classList.add(theme);
	document.documentElement.style.colorScheme = theme;
};

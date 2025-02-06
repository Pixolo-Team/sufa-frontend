/** Get Data from Local Storage */
export const getLocalStorageItem = (keyName: string) => {
	const data: string | null = localStorage.getItem(keyName);
	if (data) {
		return JSON.parse(data);
	} else {
		return false;
	}
};

/** Set Local Storage Data */
export const setLocalStorageItem = (keyName: string, data: any) => {
	localStorage.setItem(keyName, JSON.stringify(data));
	return true;
};

/** Clear the full Local Storage */
export const clearLocalStorage = () => {
	localStorage.clear();
	return true;
};

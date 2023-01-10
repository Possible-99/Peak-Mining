import { createContext, useContext, useState } from "react";

const FilesContext = createContext();

const FilesUpdateContext = createContext();

export function FilesProvider({ children }) {
	const [filesState, setFiles] = useState({
		files: [],
		fileSelected: undefined,
	});

	return (
		<FilesContext.Provider value={filesState}>
			<FilesUpdateContext.Provider value={setFiles}>{children}</FilesUpdateContext.Provider>
		</FilesContext.Provider>
	);
}

//Hooks
export function useFilesState() {
	return useContext(FilesContext);
}

export function useFilesUpdate() {
	return useContext(FilesUpdateContext);
}

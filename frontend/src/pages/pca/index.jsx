import React from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import PcaAnalysis from "./pcaAnalysis.component";

const Pca = () => {
	const filesState = useFilesState();
	const filesCount = filesState.files.length;

	return (
		<>
			{filesCount > 0 ? <PcaAnalysis /> : <FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />}
		</>
	);
};

export default Pca;

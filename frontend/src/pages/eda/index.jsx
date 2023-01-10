import React from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import EdaAnalysis from "./edaAnalysis";

const Eda = () => {
	const filesState = useFilesState();
	const filesCount = filesState.files.length;

	return (
		<>
			{filesCount > 0 ? <EdaAnalysis /> : <FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />}
		</>
	);
};

export default Eda;

import React from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import EdaAnalysis from "./edaAnalysis";
import { usePost } from "../../hooks/usePost";

const Eda = () => {
	const filesState = useFilesState();
	const filesCount = filesState.files.length;
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/data_table", sendData);

	return (
		<>
			{filesCount > 0 ? <EdaAnalysis /> : <FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />}
		</>
	);
};

export default Eda;

import { useState } from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import GeneralAnalysis from "./generalAnalysis";
import ClusteringAnalysis from "./clusteringAnalysis";

const Clustering = () => {
	const filesState = useFilesState();
	const filesCount = filesState.files.length;

	return (
		<>
			{filesCount > 0 ? (
				<>
					<GeneralAnalysis />
					<ClusteringAnalysis />
				</>
			) : (
				<FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />
			)}
		</>
	);
};

export default Clustering;

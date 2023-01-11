import { useState } from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import GeneralAnalysis from "./generalAnalysis";
import TreeAnalysis from "./treeAnalysis";

const Tree = () => {
	const filesState = useFilesState();
	const filesCount = filesState.files.length;

	const [xVariables, setXVariables] = useState([]);
	const [yVariable, setYVariable] = useState([]);
	const [algorithm, setAlgorithm] = useState([]);

	return (
		<>
			{filesCount > 0 ? (
				<>
					<GeneralAnalysis
						xVariables={xVariables}
						yVariable={yVariable}
						setXvariables={setXVariables}
						setYvariable={setYVariable}
						algorithm={algorithm}
						setAlgorithm={setAlgorithm}
					/>
					{xVariables.length > 0 && yVariable.length > 0 && algorithm.length > 0 && (
						<TreeAnalysis
							xVariables={xVariables}
							yVariable={yVariable}
							algorithm={algorithm}
						/>
					)}
				</>
			) : (
				<FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />
			)}
		</>
	);
};

export default Tree;

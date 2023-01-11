import { useState } from "react";
import { useFilesState } from "../../context/filesContext";
import FileMenu from "../home/fileMenu.component";
import GeneralAnalysis from "./generalAnalysis";
import SvmAnalysis from "./svmAnalysis";

const Svm = () => {
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
					{xVariables.length > 0 && yVariable.length > 0 && (
						<SvmAnalysis
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

export default Svm;

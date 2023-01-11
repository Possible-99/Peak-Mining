import { Divider, Result, Typography, Row, Col } from "antd";
import React from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat } from "../../utils/tables";
import { Heatmap, Line } from "@ant-design/plots";
import { parseObjKeys } from "../../utils/json";

const SvmAnalysis = ({ xVariables, yVariable, algorithm }) => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	sendData.append("xVariables", JSON.stringify(xVariables));
	sendData.append("yVariable", JSON.stringify(yVariable));
	sendData.append("algorithm", JSON.stringify(algorithm));
	const [data, isLoading, error] = usePost("/api/svm", sendData);
	// console.log(data["modelStatsDecision"]["cols_importance"]);
	const { Title, Text } = Typography;

	// Make code reusable!!!! , also conditional rerendering
	return (
		<>
			{isLoading ? (
				<Spinner />
			) : error ? (
				<Result
					status="warning"
					title="Intenta mas tarde o revisa las caracteristicas del archivo"
				/>
			) : (
				<>
					<Title level={1}>Máquina de vectores(SVM)</Title>
					{/* <Title level={2}>Metodo</Title>
					<Text>{data["modelStatsDecision"]["criteria"]}</Text> */}
					<Divider />
					{data["modelStatsDecision"]["supportVector"] && (
						<CustomTable
							data={JSON.parse(data["modelStatsDecision"]["supportVector"])}
							columns={colsAntdFormat(
								JSON.parse(data["modelStatsDecision"]["supportVector"])
							)}
							title="Vectores de soporte"
						/>
					)}
					<Divider />
					<Title level={2}>Exactictud del modelo</Title>
					<Text>{data["modelStatsDecision"]["accuracy"]}</Text>
				</>
			)}
		</>
	);
};

export default SvmAnalysis;

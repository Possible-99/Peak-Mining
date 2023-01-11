import { Divider, Result, Typography, Row, Col } from "antd";
import React from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat } from "../../utils/tables";
import { Heatmap, Line } from "@ant-design/plots";
import { parseObjKeys } from "../../utils/json";

const TreeAnalysis = ({ xVariables, yVariable, algorithm }) => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	sendData.append("xVariables", JSON.stringify(xVariables));
	sendData.append("yVariable", JSON.stringify(yVariable));
	sendData.append("algorithm", JSON.stringify(algorithm));
	const [data, isLoading, error] = usePost("/api/components", sendData);
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
					<Title level={1}>Arbol de decision</Title>
					<Title level={2}>Metodo</Title>
					<Text>{data["modelStatsDecision"]["criteria"]}</Text>
					<Divider />
					{data["modelStatsDecision"]["cols_importance"] && (
						<CustomTable
							data={JSON.parse(data["modelStatsDecision"]["cols_importance"])}
							columns={colsAntdFormat(
								JSON.parse(data["modelStatsDecision"]["cols_importance"])
							)}
							title="Importancia de las variables"
						/>
					)}
					<Divider />
					<Title level={2}>Exactictud del modelo</Title>
					<Text>{data["modelStatsDecision"]["accuracy"]}</Text>
					<Title level={1}>Bosque de decision</Title>
					<Title level={2}>Metodo</Title>
					<Text>{data["modelStatsRandom"]["criteria"]}</Text>
					<Divider />
					{data["modelStatsRandom"]["cols_importance"] && (
						<CustomTable
							data={JSON.parse(data["modelStatsRandom"]["cols_importance"])}
							columns={colsAntdFormat(
								JSON.parse(data["modelStatsRandom"]["cols_importance"])
							)}
							title="Importancia de las variables"
						/>
					)}
					<Divider />
					<Title level={2}>Exactictud del modelo</Title>
					<Text>{data["modelStatsRandom"]["accuracy"]}</Text>
				</>
			)}
		</>
	);
};

export default TreeAnalysis;

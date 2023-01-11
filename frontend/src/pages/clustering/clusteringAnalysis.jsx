import { Divider, Result, Typography, Row, Col } from "antd";
import { useState } from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat, dataClusters, getColsNames } from "../../utils/tables";
import { Heatmap, Scatter } from "@ant-design/plots";
import Select from "../../components/form/select.component";

const config = {
	size: 5,
	pointStyle: {
		stroke: "#777777",
		lineWidth: 1,
		fill: "#5B8FF9",
	},
	regressionLine: {
		type: "quad", // linear, exp, loess, log, poly, pow, quad
	},
};
const ClusteringAnalysis = () => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/clusteringParticional", sendData);
	console.log(data);
	const { Title } = Typography;

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
					{data["tablaGeneral"].length > 0 && (
						<CustomTable
							data={data["tablaGeneral"]}
							columns={colsAntdFormat(data["tablaGeneral"])}
							title="Tabla con centroides(con el metodo de codo)"
						/>
					)}
					{data["clustersQuantity"] && (
						<CustomTable
							data={dataClusters(data["clustersQuantity"])}
							columns={colsAntdFormat(dataClusters(data["clustersQuantity"]))}
							title="Conteo"
						/>
					)}
					{data["centroidesH"].length > 0 && (
						<>
							<Divider />
							<CustomTable
								data={data["centroidesH"]}
								columns={colsAntdFormat(data["centroidesH"])}
								title="Centroides"
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default ClusteringAnalysis;

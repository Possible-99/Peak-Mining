import { Divider, Result, Typography, Row, Col } from "antd";
import React from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat } from "../../utils/tables";
import { Heatmap, Line } from "@ant-design/plots";

const PcaAnalysis = () => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/pca", sendData);
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
					{data["table"].length > 0 && (
						<CustomTable
							data={data["table"]}
							columns={colsAntdFormat(data["table"])}
							title="Datos"
						/>
					)}
					{data["description"].length > 0 && (
						<CustomTable
							data={data["description"]}
							columns={colsAntdFormat(data["description"])}
							title="Información general"
						/>
					)}

					{data["corrTable"].length > 0 && (
						<CustomTable
							data={data["corrTable"]}
							columns={colsAntdFormat(data["corrTable"])}
							title="Tabla de correlación"
						/>
					)}
					{data["heatMap"].length > 0 && (
						<>
							<Title level={2}>Mapa de calor</Title>
							<Divider />
							<Heatmap
								autoFit
								data={data["heatMap"]}
								xField="col"
								yField="row"
								colorField="value"
								color={["#174c83", "#7eb6d4", "#efefeb", "#efa759", "#9b4d16"]}
							/>
						</>
					)}

					{data["standMatrix"].length > 0 && (
						<CustomTable
							data={data["standMatrix"]}
							columns={colsAntdFormat(data["standMatrix"])}
							title="Matriz de estandarización"
						/>
					)}
					{data["compChartVals"].length > 0 && (
						<>
							<Title level={2}>Gráfica de componentes</Title>
							<Divider />
							<Line
								data={data["compChartVals"]}
								padding="auto"
								xField="number_components"
								yField="variance"
								smooth={true}
							/>
						</>
					)}
					{data["chargeTable"].length > 0 && (
						<CustomTable
							data={data["chargeTable"]}
							columns={colsAntdFormat(data["chargeTable"])}
							title="Cargas de componentes"
						/>
					)}

					{data["maxCols"].length > 0 && (
						<CustomTable
							data={data["maxCols"]}
							columns={colsAntdFormat(data["maxCols"])}
							title="Valores máximos en las cargas"
						/>
					)}
				</>
			)}
		</>
	);
};

export default PcaAnalysis;

import { Divider, Result, Typography, Row, Col } from "antd";
import React from "react";
import BoxPlot from "../../components/graphs/boxPlot.component";
import CustomHistogram from "../../components/graphs/histogram.component";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat } from "../../utils/tables";
import { Bar, Heatmap } from "@ant-design/plots";

const EdaAnalysis = () => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/eda", sendData);
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
					{/* Put in a component? */}
					{data["histogramColumns"].length > 0 && (
						<>
							<Title level={2}> Histogramas variables numéricas</Title>
							<Row gutter={[70, 50]}>
								{data["histogramColumns"].map((numericCol) => (
									<>
										<Col span={8}>
											{<Title level={4}>{numericCol}</Title>}
											<CustomHistogram
												data={data["table"]}
												field={numericCol}
											/>
										</Col>
									</>
								))}
							</Row>
						</>
					)}
					{data["numVarStats"].length > 0 && (
						<>
							<Divider />
							<CustomTable
								data={data["numVarStats"]}
								columns={colsAntdFormat(data["numVarStats"])}
								title="Estadística Variables Numéricas"
							/>
						</>
					)}

					{data["boxPlots"].length > 0 && (
						<>
							<Divider />
							<Title level={2}> Cajas de bigote</Title>
							{data["boxPlots"] && (
								<Row gutter={[70, 50]}>
									{data["boxPlots"].map((boxPlot) => (
										<>
											<Col span={8}>
												{<Title level={4}>{boxPlot["column"]}</Title>}
												<BoxPlot
													data={[boxPlot]}
													xField="column"
													yFields={["low", "q1", "median", "q3", "high"]}
													color="#FF0000"
												/>
											</Col>
										</>
									))}
								</Row>
							)}
						</>
					)}

					{data["cathegoricalColsStats"].length > 0 && (
						<CustomTable
							data={data["cathegoricalColsStats"]}
							columns={colsAntdFormat(data["cathegoricalColsStats"])}
							title="Estadística Variables Categóricas"
						/>
					)}

					{data["cathegoricalColsPlots"].length > 0 && (
						<>
							<Divider />
							<Title level={2}> Gráficas Variables Categóricas</Title>

							<Row gutter={[70, 50]}>
								{data["cathegoricalColsPlots"].map((cathegoricalCol) => (
									<>
										<Col span={8}>
											{
												<Title level={4}>
													{cathegoricalCol["column_name"]}
												</Title>
											}
											<Bar
												data={cathegoricalCol["rows"]}
												xField="count"
												yField="value"
												seriesField="value"
											/>
										</Col>
									</>
								))}
							</Row>
						</>
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
				</>
			)}
		</>
	);
};

export default EdaAnalysis;

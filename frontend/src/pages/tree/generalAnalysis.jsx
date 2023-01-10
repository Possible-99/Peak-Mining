import { Divider, Result, Typography, Row, Col } from "antd";
import React from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat } from "../../utils/tables";
import { Heatmap } from "@ant-design/plots";

const GeneralAnalysis = () => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/general_analysis", sendData);
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
							title="Informacion general"
						/>
					)}
					{data["numVarStats"].length > 0 && (
						<>
							<Divider />
							<CustomTable
								data={data["numVarStats"]}
								columns={colsAntdFormat(data["numVarStats"])}
								title="Estadistica Variabes Numericas"
							/>
						</>
					)}
					{data["corrTable"].length > 0 && (
						<CustomTable
							data={data["corrTable"]}
							columns={colsAntdFormat(data["corrTable"])}
							title="Tabla de Correlacion"
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

export default GeneralAnalysis;

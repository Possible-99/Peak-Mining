import { Divider, Result, Typography, Row, Col } from "antd";
import { useState } from "react";
import CustomTable from "../../components/tables/table.component";
import Spinner from "../../components/ui/spinner.component";
import { useFilesState } from "../../context/filesContext";
import { usePost } from "../../hooks/usePost";
import { colsAntdFormat, getColsNames } from "../../utils/tables";
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

const GeneralAnalysis = ({}) => {
	const filesState = useFilesState();
	var sendData = new FormData();
	sendData.append("file", filesState.files[filesState.fileSelected]);
	const [data, isLoading, error] = usePost("/api/general_analysis", sendData);
	console.log(data);
	const { Title } = Typography;

	const [xScatter, setXScatter] = useState([]);
	const [yScatter, setYScatter] = useState([]);

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
					{/* {data["table"].length > 0 && (
						<CustomTable
							data={data["table"]}
							columns={colsAntdFormat(data["table"])}
							title="Datos"
						/>
					)} */}

					{data["numericCols"].length > 0 && (
						<>
							<Title level={2}>Grafica de dispersion</Title>
							<Select
								availableOptions={data["numericCols"]}
								onChange={setXScatter}
								selectedItems={xScatter}
								style={{}}
							/>
							<Select
								availableOptions={data["numericCols"]}
								onChange={setYScatter}
								selectedItems={yScatter}
								style={{}}
							/>
							<Scatter
								{...config}
								data={data["table"]}
								xField={xScatter}
								yField={yScatter}
								colors={["#174c83", "#7eb6d4", "#efefeb", "#efa759", "#9b4d16"]}
							/>
						</>
					)}
				</>
			)}
		</>
	);
};

export default GeneralAnalysis;

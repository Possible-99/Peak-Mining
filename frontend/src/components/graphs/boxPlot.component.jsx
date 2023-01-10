import { Box } from "@ant-design/plots";

const BoxPlot = ({ data, xField, yFields, color }) => {
	return (
		<Box
			data={data}
			xField={xField}
			yField={yFields}
			outliersField="outliers"
			outliersStyle={{
				fill: color,
			}}
		/>
	);
};

export default BoxPlot;

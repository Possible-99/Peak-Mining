import { Histogram } from "@ant-design/plots";

const CustomHistogram = ({ data, field }) => {
	const config = {
		data,
		binField: field,
		autofit: true,
		// binWidth: 2,
	};

	return <Histogram {...config} />;
};

export default CustomHistogram;

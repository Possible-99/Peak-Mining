import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const antIcon = <LoadingOutlined style={{ fontSize: "15rem" }} spin />;
const Spinner = () => {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				height: "100% ",
			}}
		>
			<Spin indicator={antIcon} />;
		</div>
	);
};

export default Spinner;

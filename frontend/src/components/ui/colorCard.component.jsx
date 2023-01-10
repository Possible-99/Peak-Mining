import { Card } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";

const ColorCard = ({ title, content, selected, onClick, colors }) => {
	const ext = title.split(".").pop();

	return (
		<Card
			title={title}
			bordered={false}
			style={{
				height: "100%",
				backgroundColor: colors[ext] ? colors[ext] : "#DC143C",
				color: "white",
				border: "0",
			}}
			headStyle={{ backgroundColor: "#FAF9F6" }}
			hoverable
			onClick={onClick}
			extra={selected ? <CheckCircleFilled /> : null}
		>
			{content}
		</Card>
	);
};

export default ColorCard;

import { Divider, Table, Typography } from "antd";

const props = {};

const CustomTable = ({
	data,
	columns,
	caption = "",
	footer = "",
	bordered = false,
	size = "middle",
	title = "",
}) => {
	const { Title } = Typography;
	return (
		<>
			{title && (
				<>
					<Title level={2}>{title}</Title>
					<Divider />
				</>
			)}
			<Table
				columns={columns}
				dataSource={data}
				caption={caption}
				footer={() => footer}
				bordered={bordered}
				size={size}
				scroll={{
					x: true,
				}}
			/>
		</>
	);
};

export default CustomTable;

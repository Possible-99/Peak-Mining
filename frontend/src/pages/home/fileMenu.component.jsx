import { Typography, Divider, Row, Col, Card, Button, Avatar } from "antd";
import { LoadingOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import Upload from "antd/es/upload/Upload";
import { useState } from "react";
import ColorCard from "../../components/ui/colorCard.component";
import { useFilesState, useFilesUpdate } from "../../context/filesContext";

const colors = {
	csv: "#F28C28",
	txt: "#6495ED",
	xlx: "#50C878",
};

const { Title } = Typography;
const FileMenu = ({ title }) => {
	const filesState = useFilesState();
	const setFilesState = useFilesUpdate();

	const beforeUpload = (file) => {
		setFilesState({ fileSelected: 0, files: [file, ...filesState.files] });
		return false;
	};

	return (
		<>
			<Title level={4}>{title}</Title>
			<Divider orientationMargin={5} />
			<div
				style={
					{
						/*overflowX: "auto" */
					}
				}
			>
				<Row gutter={[16, 24]} style={{ height: "10rem" }}>
					<Col span={4}>
						<Upload
							style={{ cursor: "pointer" }}
							beforeUpload={beforeUpload}
							showUploadList={false}
						>
							<Avatar
								icon={<PlusOutlined />}
								size={{
									xs: 24,
									sm: 32,
									md: 40,
									lg: 64,
									xl: 180,
									xxl: 180,
								}}
								shape="square"
								style={{ cursor: "pointer" }}
							/>
						</Upload>
					</Col>
					{filesState.files.map((file, index) => (
						<Col span={5} key={index}>
							<ColorCard
								idx={index}
								title={file.name}
								content={"Tamaño : " + file.size + " KB"}
								selected={filesState.fileSelected === index}
								colors={colors}
								onClick={() => {
									setFilesState((lastState) => ({
										...lastState,
										fileSelected: index,
									}));
								}}
							/>
						</Col>
					))}
				</Row>
			</div>
		</>
	);
};

export default FileMenu;

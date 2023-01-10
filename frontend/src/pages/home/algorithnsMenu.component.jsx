import { Card, Divider, Row, Typography, Col } from "antd";
import { Link } from "react-router-dom";
import React from "react";

const algorithms = [
	{ name: "EDA", path: "/dashboard/eda" },
	{ name: "PCA", path: "/dashboard/pca" },
	{ name: "COMP", path: "/dashboard/comp" },
];

const AlgorithmsMenu = () => {
	const { Title } = Typography;
	return (
		<>
			<Title level={4}>Selecciona un algoritmo</Title>
			<Divider />
			<Row gutter={[16, 30]}>
				{algorithms.map((algorithm) => (
					<Col span={5}>
						<Link to={algorithm.path}>
							<Card bordered={false} hoverable>
								{algorithm.name}
							</Card>
						</Link>
					</Col>
				))}
			</Row>
		</>
	);
};

export default AlgorithmsMenu;

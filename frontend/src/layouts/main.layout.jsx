import React, { useState } from "react";
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	UploadOutlined,
	ApartmentOutlined,
	ExperimentFilled,
	UserOutlined,
	UngroupOutlined,
	VideoCameraOutlined,
	DesktopOutlined,
	GroupOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
const { Header, Sider, Content } = Layout;
const MainLayout = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const {
		token: { colorBgContainer },
	} = theme.useToken();
	return (
		<Layout hasSider>
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				style={{
					overflow: "auto",
					height: "100vh",
					position: "fixed",
					left: 0,
					top: 0,
					bottom: 0,
				}}
			>
				<div className="logo" />
				<Menu
					theme="dark"
					mode="inline"
					// defaultSelectedKeys={["1"]}
					items={[
						{
							key: "1",
							icon: (
								<Link to="/dashboard">
									<UserOutlined />
								</Link>
							),
							label: "Home",
						},
						{
							key: "2",
							icon: (
								<Link to="/dashboard/eda">
									<ExperimentFilled />
								</Link>
							),
							label: "EDA",
						},
						{
							key: "3",
							icon: (
								<Link to="/dashboard/pca">
									{" "}
									<UngroupOutlined />
								</Link>
							),
							label: "PCA",
						},
						{
							key: "4",
							icon: (
								<Link to="/dashboard/tree">
									<ApartmentOutlined />
								</Link>
							),
							label: "Árboles",
						},
						{
							key: "5",
							icon: (
								<Link to="/dashboard/clustering">
									<GroupOutlined />
								</Link>
							),
							label: "Clustering",
						},
						{
							key: "6",
							icon: (
								<Link to="/dashboard/svm">
									<DesktopOutlined />
								</Link>
							),
							label: "SVM",
						},
					]}
				/>
			</Sider>
			<Layout
				className="site-layout"
				style={{
					marginLeft: collapsed ? 80 : 200,
				}}
			>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer,
					}}
				>
					{React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
						className: "trigger",
						onClick: () => setCollapsed(!collapsed),
						style: { padding: "2rem" },
					})}
				</Header>
				<Content
					style={{
						margin: "24px 16px",
						padding: 24,
						minHeight: "100vh",
						background: colorBgContainer,
					}}
				>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	);
};
export default MainLayout;

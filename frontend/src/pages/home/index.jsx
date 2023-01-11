import { Space } from "antd";
import { useFilesState } from "../../context/filesContext";
import AlgorithmsMenu from "./algorithnsMenu.component";
import FileMenu from "./fileMenu.component";

const Home = () => {
	const fileState = useFilesState();
	return (
		<div>
			<Space
				direction="vertical"
				size={250}
				style={{
					display: "flex",
				}}
			>
				<FileMenu title={"SUBE O SELECCIONA UN ARCHIVO"} />
				{fileState.files.length > 0 && <AlgorithmsMenu />}
			</Space>
		</div>
	);
};

export default Home;

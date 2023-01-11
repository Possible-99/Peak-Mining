import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import MainLayout from "./layouts/main.layout";
import { FilesProvider } from "./context/filesContext";
import Eda from "./pages/eda";
import Pca from "./pages/pca";
import Tree from "./pages/tree";
import Clustering from "./pages/clustering";
import Svm from "./pages/svm/index";

const App = () => (
	<FilesProvider>
		<Routes>
			<Route path="/dashboard" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="eda" element={<Eda />} />
				<Route path="pca" element={<Pca />} />
				<Route path="tree" element={<Tree />} />
				<Route path="clustering" element={<Clustering />} />
				<Route path="svm" element={<Svm />} />
			</Route>
			<Route path="*" element={<h1> Not found</h1>} />
		</Routes>
	</FilesProvider>
);

export default App;

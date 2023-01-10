import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import MainLayout from "./layouts/main.layout";
import { FilesProvider } from "./context/filesContext";
import Eda from "./pages/eda";
import Pca from "./pages/pca";

const App = () => (
	<FilesProvider>
		<Routes>
			<Route path="/dashboard" element={<MainLayout />}>
				<Route index element={<Home />} />
				<Route path="eda" element={<Eda />} />
				<Route path="pca" element={<Pca />} />
				<Route path="comp" element={<h1>Components</h1>} />
			</Route>
			<Route path="*" element={<h1> Not found</h1>} />
		</Routes>
	</FilesProvider>
);

export default App;

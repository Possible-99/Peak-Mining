import axios from "axios";
import { useEffect, useState } from "react";
import { parseObjKeys } from "../utils/json";

export function usePost(url, sendData) {
	const [data, setData] = useState();
	const [isLoading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// console.log(sendData);
	//TODO : Maybe useMemo can solve the double call back

	useEffect(() => {
		axios
			.post(url, sendData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then(({ data }) => setData(parseObjKeys(data)))
			.catch((error) => setError(error))
			.finally(() => setLoading(false));
	}, []);

	return [data, isLoading, error];
}

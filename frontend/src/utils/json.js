export function parseObjKeys(obj) {
	console.log(obj);
	for (const property in obj) {
		if (typeof obj[property] === "string") {
			if (obj[property] !== "" && (obj[property][0] === "[" || obj[property][0] === "{"))
				obj[property] = JSON.parse(obj[property]);
		}
	}
	return obj;
}

export function parseObjKeys(obj) {
	console.log(obj);
	for (const property in obj) {
		if (typeof obj[property] === "string") {
			obj[property] = JSON.parse(obj[property]);
		}
	}
	return obj;
}

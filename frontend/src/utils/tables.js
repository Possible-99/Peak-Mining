export function getColsNames(tableArr) {
	if (tableArr === []) {
		return [];
	}
	const rowObj = tableArr[0];
	return Object.keys(rowObj);
}

export function colsAntdFormat(tableArr) {
	const keys = getColsNames(tableArr);

	var colsFormat = [];

	for (const idx in keys) {
		const value = keys[idx];
		colsFormat.push({
			title: value,
			dataIndex: value,
			key: value,
			sorter: (a, b) => a[value] - b[value],
		});
	}
	console.log(colsFormat);
	return colsFormat;
}

export function dataClusters(obj) {
	var form = [];

	for (const key in obj) {
		var name = "cluster" + key;
		var newObj = {};
		newObj["name"] = name;
		newObj["count"] = obj[key];
		form.push(newObj);
	}
	return form;
}

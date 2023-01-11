import React, { useState } from "react";
import { Select as SelectAntd } from "antd";
const Select = ({
	mode = "",
	placeholder = "Selecciona",
	onChange = () => console.log("error"),
	availableOptions = [],
	selectedItems = [],
	style = {
		width: "100%",
	},
}) => {
	const filteredOptions = availableOptions.filter((o) => !selectedItems.includes(o));
	return (
		<SelectAntd
			mode={mode}
			placeholder={placeholder}
			value={selectedItems}
			onChange={onChange}
			style={style}
			options={filteredOptions.map((item) => ({
				value: item,
				label: item,
			}))}
		/>
	);
};
export default Select;

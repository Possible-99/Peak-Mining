import React, { useState } from "react";
import { Select as SelectAntd } from "antd";
const Select = ({
	mode = "multiple",
	placeholder = "Selecciona",
	onChange = () => console.log("error"),
	availableOptions = [],
	selectedItems = [],
}) => {
	const filteredOptions = availableOptions.filter((o) => !selectedItems.includes(o));
	return (
		<SelectAntd
			mode={mode}
			placeholder={placeholder}
			value={selectedItems}
			onChange={onChange}
			style={{
				width: "100%",
			}}
			options={filteredOptions.map((item) => ({
				value: item,
				label: item,
			}))}
		/>
	);
};
export default Select;

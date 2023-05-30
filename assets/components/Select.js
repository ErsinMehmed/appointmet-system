import React from "react";

const Select = (props) => {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="props.for">{props.label}</label>
      <select
        onChange={handleChange}
        value={props.value}
        id={props.id}
        className="form-select"
      >
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;


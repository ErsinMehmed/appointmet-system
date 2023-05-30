import React from "react";

function Input(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <div className="form-group mb-2">
      <label htmlFor="props.for">{props.label}</label>
      <input
        onChange={handleChange}
        value={props.value}
        type={props.type}
        id={props.id}
        name={props.name}
        maxLength={props.maxLength}
        className="form-control"
        required
      />
    </div>
  );
}

export default Input;

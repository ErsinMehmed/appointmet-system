import React from "react";

function Input(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  const hasError = props.errors && props.errors.hasOwnProperty(props.name);

  return (
    <div className={`form-group mb-2 ${hasError ? "has-error" : ""}`}>
      <label htmlFor={props.id} className={`${hasError ? "text-danger" : ""}`}>{props.label}</label>

      <input
        onChange={handleChange}
        value={props.value || ""}
        type={props.type}
        id={props.id}
        name={props.name}
        maxLength={props.maxLength}
        className={`form-control ${hasError ? "is-invalid" : ""}`}
      />
      
      {hasError && <div className="invalid-feedback">{props.errors[props.name]}</div>}
    </div>
  );
}

export default Input;

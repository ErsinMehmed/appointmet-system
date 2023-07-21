import React from "react";

function Textarea(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  const hasError = props.errors && props.errors.hasOwnProperty(props.name);

  return (
    <div className={`form-group ${hasError ? "has-error" : ""} w-100 mt-2`}>
      <label htmlFor={props.id} className={`${hasError ? "text-danger" : ""}`}>
        {props.label}
      </label>

      <textarea
        onChange={handleChange}
        value={props.value}
        className={`form-control ${hasError ? "is-invalid" : ""}`}
        id={props.id}
        name={props.name}
      />

      {hasError && (
        <div className="invalid-feedback">{props.errors[props.name]}</div>
      )}
    </div>
  );
}

export default Textarea;

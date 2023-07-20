import React from "react";

const Select = (props) => {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  const hasError = props.errors && props.errors.hasOwnProperty(props.name);

  return (
    <div className={`form-group ${hasError ? "has-error" : ""}`}>
      <label htmlFor={props.id} className={`${hasError ? "text-danger" : ""}`}>{props.label}</label>

      <select
        onChange={handleChange}
        value={props.value || ""}
        id={props.id}
        className={`form-select ${hasError ? "is-invalid" : ""}`}
      >
        <option hidden>
          Select {props.text}
        </option>

        {props.options.map((option, index) => (
          <option key={index} value={typeof option === "object" ? Object.values(option)[0] : option}>
            {typeof option === "object" ? Object.values(option)[1] : option}
          </option>
        ))}
      </select>

      {hasError && <div className="invalid-feedback">{props.errors[props.name]}</div>}
    </div>
  );
};

export default Select;
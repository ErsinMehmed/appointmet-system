import React from "react";

function Textarea(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <div className="form-group">
      <label htmlFor="description">{props.label}</label>
      <textarea
        onChange={handleChange}
        value={props.value}
        className="form-control"
        id={props.id}
        name={props.name}
        required
      />
    </div>
  );
}

export default Textarea;


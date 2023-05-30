import React from "react";

function PrimaryButton(props) {
  return (
    <button
      className="btn btn-primary mx-1"
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default PrimaryButton;


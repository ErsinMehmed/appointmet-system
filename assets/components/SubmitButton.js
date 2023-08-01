import React, { forwardRef } from "react";

const SubmitButton = forwardRef((props, ref) => {
  return (
    <button
      ref={ref}
      disabled={props.isSaving}
      onClick={props.submit}
      type="button"
      className="btn btn-primary mt-3"
    >
      {props.isSaving && <span className="spinner-border spinner-border-sm" />}
      {props.text}
    </button>
  );
});

export default SubmitButton;

import React from "react";

function ErrorAlert(props) {
  return (
    props.errorsBag &&
    props.errorsBag.length > 0 && (
      <div className="alert alert-danger">
        {props.errorsBag.map((error, index) => (
          <div className="mb-2" key={index}>
            {error}
          </div>
        ))}
      </div>
    )
  );
}

export default ErrorAlert;

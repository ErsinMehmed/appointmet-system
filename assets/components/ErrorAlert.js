import React from "react";

function ErrorAlert(props) {
  return (
    props.errors &&
    Object.keys(props.errors).length > 0 && (
      <div className="alert alert-danger">
        {Object.values(props.errors).map((error, index) => (
          <div className="mb-2" key={index}>
            {error}
          </div>
        ))}
      </div>
    )
  );
}

export default ErrorAlert;

import React from "react";

function ErrorAlert(props) {
  return (
    props.errorsBag && Object.keys(props.errorsBag).length > 0 && (
      <div className="alert alert-danger">
        {Object.values(props.errorsBag).map((error, index) => (
          <div className="mb-2" key={index}>
            {error}
          </div>
        ))}
      </div>
    )
  );
}

export default ErrorAlert;

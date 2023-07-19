import React from "react";

function Loader() {
  return (
    <div className='d-flex align-items-center justify-content-center vh-100'>
      <div
        className='spinner-border text-dark mr-3'
        role='status'
      />
      Loading appointment details...
    </div>
  );
}

export default Loader;

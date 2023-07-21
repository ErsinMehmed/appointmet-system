import React from "react";
import { Link } from "react-router-dom";

function BackButton() {
  return (
    <Link
      className="btn btn-primary mt-2 mb-2 d-flex flex-column align-items-center"
      to="/"
    >
      Back To Appointment List
    </Link>
  );
}

export default BackButton;

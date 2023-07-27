import React from "react";
import { Link } from "react-router-dom";

function BackButton(props) {
  return (
    <Link
      className="btn btn-primary mt-2 mb-2 d-flex flex-column align-items-center"
      to={props.link || "/"}
    >
      Back To {props.text || "Appointments"} List
    </Link>
  );
}

export default BackButton;

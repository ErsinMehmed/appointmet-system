import Swal from "sweetalert2";

export function validateFields(name, personal_number, date, description) {
  if (
    name === "" &&
    personal_number === "" &&
    date === "" &&
    description === ""
  ) {
    message(
      "error",
      "Name, Personal Number, Date and Description are required fields.",
      true,
      true
    );
    return;
  }

  if (name === "") {
    message("error", "Name are required fields.", true, true);
    return;
  }

  if (personal_number == "") {
    message("error", "Personal Number are required fields.", true, true);
    return;
  } else if (isNaN(personal_number)) {
    message(
      "error",
      "Please enter a numeric value for the Personal Number.",
      true,
      true
    );
    return;
  } else if (personal_number.length !== 10) {
    message("error", "Please provide a 10-digit Personal Number.", true, true);
    return false;
  }

  if (date === "") {
    message("error", "Date are required fields.", true, true);
    return;
  }

  if (description === "") {
    message("error", "Description are required fields.", true, true);
    return;
  }
}

export function message(kind, text, confirmButton, closeButton, time) {
  Swal.fire({
    icon: kind,
    title: text,
    showConfirmButton: confirmButton,
    showCloseButton: closeButton,
    timer: time,
  });
}


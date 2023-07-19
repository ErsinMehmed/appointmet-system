import Swal from "sweetalert2";

export function replaceUnderscores(text) {
  return text.replace(/_/g, ' ');
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


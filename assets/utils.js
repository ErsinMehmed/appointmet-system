import Swal from "sweetalert2";

export function replaceUnderscores(text) {
  return text.replace(/_/g, " ");
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

export function formatDate(date) {
  const dateTime = new Date(date);
  const year = dateTime.getFullYear();
  const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
  const day = dateTime.getDate().toString().padStart(2, "0");
  const hours = dateTime.getHours().toString().padStart(2, "0");
  const minutes = dateTime.getMinutes().toString().padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

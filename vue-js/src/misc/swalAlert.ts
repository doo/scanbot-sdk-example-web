import Swal from "sweetalert2";

export async function swalAlert(message: string) {
  await Swal.fire({ text: message });
}
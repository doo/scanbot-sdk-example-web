import Swal from "sweetalert2";

export function onError(e: any): void {
    console.log(e.name + ': ' + e.message);
    Swal.fire({ text: e.name + ': ' + e.message });
}
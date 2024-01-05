import { swalAlert } from "./swalAlert";

export function onError(e: any): void {
    console.log(e.name + ': ' + e.message);
    swalAlert(e.name + ': ' + e.message);
}
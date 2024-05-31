import { Barcode } from "scanbot-web-sdk/@types";
import Swal from "sweetalert2";

export class Utils {
  static generateUUID() {
    const length = 5;
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static formatBarcodes(codes: Barcode[]): string {
    return JSON.stringify(
      codes.map((code: Barcode) => {
        if (code.parsedDocument) {
          return code.parsedDocument;
        } else {
          return code.text + " (" + code.format + ") ";
        }
      })
    );
  }

  static async alert(message: string) {
    await Swal.fire({text: message});
  }

  static async alertHtml(html: string) {
    await Swal.fire({html: html});
  }
}

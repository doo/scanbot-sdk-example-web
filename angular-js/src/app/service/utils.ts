import { BarcodeItem } from "scanbot-web-sdk/@types";
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

  static formatBarcodes(codes: BarcodeItem[]): string {
    return JSON.stringify(
      codes.map((code: BarcodeItem) => {
        if (code.extractedDocument) {
          return code.extractedDocument;
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
    await Swal.fire({html});
  }
}

import Swal from "sweetalert2";

export class MiscUtils {
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

  static async alert(message: string) {
    await Swal.fire({text: message});
  }
}

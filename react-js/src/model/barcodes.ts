import { BarcodeItem } from "scanbot-web-sdk/@types";

export default class Barcodes {
  public static instance = new Barcodes();

  private list: BarcodeItem[] = [];

  count() {
    return this.list.length;
  }

  public add(code: BarcodeItem) {
    this.list.push(code);
  }

  public addAll(codes: BarcodeItem[]) {
    codes.forEach((code: BarcodeItem) => {
      this.add(code);
    });
  }
}

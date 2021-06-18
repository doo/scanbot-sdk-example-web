import {Barcode} from "scanbot-web-sdk/@types";

export default class Barcodes {

    public static instance = new Barcodes();

    private list: Barcode[] = [];

    count() {
        return this.list.length;
    }

    public add(code: Barcode) {
        this.list.push(code);
    }

    public addAll(codes: Barcode[]) {
        codes.forEach((code: Barcode) => {
            this.add(code);
        })
    }

    public static format(codes: Barcode[]): string {
        return JSON.stringify(codes.map((code: Barcode) => code.text + " (" + code.format + ") "));
    }

}

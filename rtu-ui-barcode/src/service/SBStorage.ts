
import { BarcodeScannerUIItem } from "scanbot-web-sdk/@types/ui2/configuration/barcode/BarcodeScannerUIResult";

export default class SBStorage {

    public static readonly instance = new SBStorage();

    private barcodes: BarcodeScannerUIItem[] = [];

    public addBarcode(barcode: BarcodeScannerUIItem) {
        this.barcodes.push(barcode);
    }

    addBarcodes(items: BarcodeScannerUIItem[]) {
        this.barcodes = [...this.barcodes, ...items];
    }

    public getBarcodes() {
        return this.barcodes;
    }

    public clearBarcodes() {
        this.barcodes = [];
    }

    public async toBase64(data: Uint8Array): Promise<string> {
        // See https://stackoverflow.com/a/39452119
        const base64url = await new Promise<string>(resolve => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.readAsDataURL(new Blob([data]))
        });
        // remove the `data:...;base64,` part from the start
        return base64url.slice(base64url.indexOf(',') + 1);
    }
}

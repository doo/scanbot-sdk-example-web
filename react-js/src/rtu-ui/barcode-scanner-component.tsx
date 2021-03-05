
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {BarcodeResult} from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import {AnimationType} from "./enum/animation-type";
import Barcodes from "../model/barcodes";

export default class BarcodeScannerComponent extends BaseScannerComponent {

    render() {
        return this.controller(ScanbotSdkService.BARCODE_SCANNER_CONTAINER, "Barcode Scanner", this.labelText());
    }

    onBarcodesDetected(result: BarcodeResult) {
        this.props.onBarcodesDetected(result);
        document.getElementById("count-label")!.innerHTML = this.labelText();
    }

    labelText() {
        return Barcodes.instance.count() + " Barcodes";
    }

    async push(type: AnimationType) {
        this.pushType = type;
        this.updateAnimationType(type, async () => {
            await ScanbotSdkService.instance.createBarcodeScanner(this.onBarcodesDetected.bind(this));
        });
    }

    pop() {
        this.updateAnimationType(AnimationType.Pop, () => {
            ScanbotSdkService.instance.disposeBarcodeScanner();
        });
    }
}

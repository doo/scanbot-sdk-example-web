import React from "react";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {BarcodeResult} from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import {AnimationType} from "./enum/animation-type";

export default class BarcodeScannerComponent extends BaseScannerComponent {

    render() {
        return this.controller(ScanbotSdkService.BARCODE_SCANNER_CONTAINER, "Barcode Scanner");
    }

    onBarcodesDetected(result: BarcodeResult) {
        this.props.onBarcodesDetected(result);
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

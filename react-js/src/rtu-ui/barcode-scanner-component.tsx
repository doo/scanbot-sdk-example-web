import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { BarcodeResult } from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";
import Barcodes from "../model/barcodes";

export default class BarcodeScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.BARCODE_SCANNER_CONTAINER,
      "Barcode Scanner",
      this.labelText()
    );
  }

  onBarcodesDetected(result: BarcodeResult) {
    this.props.onBarcodesDetected(result);
    document.getElementById("count-label")!.innerHTML = this.labelText();
  }

  onBarcodeScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.pop();
  }

  labelText() {
    return Barcodes.instance.count() + " Barcodes";
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      await ScanbotSdkService.instance.createBarcodeScanner(
        this.onBarcodesDetected.bind(this),
        this.onBarcodeScannerError.bind(this),
      );
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeBarcodeScanner();
    });
  }
}

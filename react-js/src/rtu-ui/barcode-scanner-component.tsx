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
      this.labelText(),
      () => {
        this.onCameraSwap(ScanbotSdkService.instance.barcodeScanner!, true);
      },
      () => {
        this.onCameraSwitch(ScanbotSdkService.instance.barcodeScanner!);
      }
    );
  }

  onBarcodesDetected(result: BarcodeResult) {
    this.props.onBarcodesDetected(result);
    const label = document.getElementById("count-label");
    if (label) {
      label.innerHTML = this.labelText();
    }
  }

  onBarcodeScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
  }

  labelText() {
    return Barcodes.instance.count() + " Barcodes";
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      try {
        await ScanbotSdkService.instance.createBarcodeScanner(
          this.onBarcodesDetected.bind(this),
          this.onBarcodeScannerError.bind(this),
          this.props.additionalConfig ?? {}
        );
      } catch (e: any) {
        this.onBarcodeScannerError(e);
        this.pop()
      }
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeBarcodeScanner();
    });
  }
}

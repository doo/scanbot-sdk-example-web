import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { BarcodeResult } from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import Barcodes from "../model/barcodes";

export default class BarcodeScannerComponent extends BaseScannerComponent {

  constructor(props: any) {
    super(props, ScanbotSdkService.BARCODE_SCANNER_CONTAINER);
  }

  render() {
    return this.controller(
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

  labelText() {
    return Barcodes.instance.count() + " Barcodes";
  }

  async componentDidMount() {
    super.componentDidMount();
    try {
      await ScanbotSdkService.instance.createBarcodeScanner(
        this.onBarcodesDetected.bind(this),
        this.onScannerError.bind(this),
        this.props.additionalConfig ?? {}
      );
    } catch (e: any) {
      this.onScannerError(e);
    }
  }

  async componentWillUnmount() {
    ScanbotSdkService.instance.disposeBarcodeScanner();
  }
}

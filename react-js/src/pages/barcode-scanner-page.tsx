import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";

export default class BarcodeScannerPage extends React.Component<any, any> {
  async componentDidMount(): Promise<void> {
    await ScanbotSdkService.instance.createBarcodeScanner(
      this.props.onBarcodesDetected,
      this.props.onBarcodeDetectionError,
    );
  }

  componentWillUnmount(): void {
    ScanbotSdkService.instance.disposeBarcodeScanner();
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div
          id={ScanbotSdkService.BARCODE_SCANNER_CONTAINER}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

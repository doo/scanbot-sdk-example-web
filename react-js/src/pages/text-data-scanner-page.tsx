import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";

export default class TextDataScannerPage extends React.Component<any, any> {
  async componentDidMount(): Promise<void> {
    await ScanbotSdkService.instance.createTextDataScanner(
      this.props.onTextDatasDetected,
      this.props.onTextDataDetectionError,
    );
  }

  componentWillUnmount(): void {
    ScanbotSdkService.instance.disposeTextDataScanner();
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div
          id={ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

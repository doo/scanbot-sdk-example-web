import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";

export default class MrzScannerPage extends React.Component<any, any> {
  async componentDidMount(): Promise<void> {
    await ScanbotSdkService.instance.createMrzScanner(
      this.props.onMrzsDetected,
      this.props.onMrzDetectionError,
    );
  }

  componentWillUnmount(): void {
    ScanbotSdkService.instance.disposeMrzScanner();
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div
          id={ScanbotSdkService.MRZ_SCANNER_CONTAINER}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

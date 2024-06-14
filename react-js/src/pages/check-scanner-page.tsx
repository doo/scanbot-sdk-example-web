
import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types";

export default class CheckScannerPage extends React.Component<any, any> {

  async componentDidMount(): Promise<void> {
    await ScanbotSdkService.instance.createDocumentScanner(
      async (result: DocumentDetectionResult) => {
        // Flash on recognition just to give the user some visual feedback that something was detected
        ScanbotSdkService.instance.sdk?.utils.flash();
        // If a cropped image exists, use that, otherwise use the original
        const check = await ScanbotSdkService.instance.recognizeCheck(result.cropped ?? result.original);
        console.log(check);
      },
      () => {
        // Handle errors
        ScanbotSdkService.instance.disposeDocumentScanner();
      },
    );
  }

  componentWillUnmount(): void {
    ScanbotSdkService.instance.disposeDocumentScanner();
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div
          id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

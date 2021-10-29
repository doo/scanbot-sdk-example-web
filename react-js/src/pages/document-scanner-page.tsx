import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import styled, { keyframes } from "styled-components";

export default class DocumentScannerPage extends React.Component<any, any> {
  async componentDidMount(): Promise<void> {
    await ScanbotSdkService.instance.createDocumentScanner(
      this.props.onDocumentDetected
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

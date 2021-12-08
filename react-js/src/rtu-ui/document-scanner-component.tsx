import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";
import Pages from "../model/pages";

export default class DocumentScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER,
      "Document Scanner",
      this.labelText()
    );
  }

  onDocumentDetected(result: DocumentDetectionResult) {
    this.props.onDocumentDetected(result);
    document.getElementById("count-label")!.innerHTML = this.labelText();
  }

  onDocumentScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.pop();
  }

  labelText() {
    return Pages.instance.count() + " Pages";
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      await ScanbotSdkService.instance.createDocumentScanner(
        this.onDocumentDetected.bind(this),
        this.onDocumentScannerError.bind(this),
      );
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeDocumentScanner();
    });
  }
}

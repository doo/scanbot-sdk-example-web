import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import Pages from "../model/pages";

export default class DocumentScannerComponent extends BaseScannerComponent {
  constructor(props: any) {
    super(props, ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER);
  }

  render() {
    return this.controller(
      "Document Scanner",
      this.labelText(),
      () => {
        this.onCameraSwap(ScanbotSdkService.instance.documentScanner!, true);
      },
      () => {
        this.onCameraSwitch(ScanbotSdkService.instance.documentScanner!);
      }
    );
  }

  onDocumentDetected(result: DocumentDetectionResult) {
    this.props.onDocumentDetected(result);
    const label = document.getElementById("count-label");
    
    if (label) {
      label.innerHTML = this.labelText();
    }
    
  }

  labelText() {
    return Pages.instance.count() + " Pages";
  }

  async componentDidMount() {
    super.componentDidMount();
    try {
      await ScanbotSdkService.instance.createDocumentScanner(
        this.onDocumentDetected.bind(this),
        this.onScannerError.bind(this),
      );
    } catch (e: any) {
      this.onScannerError(e);
    }
  }

  componentWillUnmount() {
    ScanbotSdkService.instance.disposeDocumentScanner();
  }
}

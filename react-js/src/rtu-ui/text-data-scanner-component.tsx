import { TextDataScannerResult } from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";

export default class TextDataScannerComponent extends BaseScannerComponent {
  constructor(props: any) {
    super(props, ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER);
  }

  render() {
    return this.controller(
      "Text Data Scanner",
      "",
      () => {
        this.onCameraSwap(ScanbotSdkService.instance.textDataScanner!, true);
      },
      () => {
        this.onCameraSwitch(ScanbotSdkService.instance.textDataScanner!);
      }
    );
  }

  onTextDataDetected(result: TextDataScannerResult) {
    this.props.onTextDataDetected(result);
  }

  async componentDidMount() {
    super.componentDidMount();
    try {
      await ScanbotSdkService.instance.createTextDataScanner(
        this.onTextDataDetected.bind(this),
        this.onScannerError.bind(this)
      );
    } catch (e: any) {
      this.onScannerError(e);
    }
  }

  componentWillUnmount() {
    ScanbotSdkService.instance.disposeTextDataScanner();
  }
}

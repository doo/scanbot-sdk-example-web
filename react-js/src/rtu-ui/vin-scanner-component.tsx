import { TextDataScannerResult } from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";

export default class VINScannerComponent extends BaseScannerComponent {
  constructor(props: any) {
    super(props, ScanbotSdkService.VIN_SCANNER_CONTAINER);
  }

  render() {
    return this.controller(
      "VIN Scanner",
      "",
      () => {
        this.onCameraSwap(ScanbotSdkService.instance.vinScanner!, true);
      },
      () => {
        this.onCameraSwitch(ScanbotSdkService.instance.vinScanner!);
      }
    );
  }

  onVINDetected(result: TextDataScannerResult) {
    this.props.onVINDetected(result);
  }

  onVINScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
  }

  async componentDidMount() {
    super.componentDidMount();
    try {
      await ScanbotSdkService.instance.createVINScanner(
        this.onVINDetected.bind(this),
        this.onScannerError.bind(this)
      );
    } catch (e: any) {
      this.onScannerError(e);
    }
  }

  componentWillUnmount() {
    ScanbotSdkService.instance.disposeVINScanner();
  }
}

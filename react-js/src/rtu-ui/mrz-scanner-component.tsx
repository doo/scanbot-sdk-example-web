import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";

export default class MrzScannerComponent extends BaseScannerComponent {
  constructor(props: any) {
    super(props, ScanbotSdkService.MRZ_SCANNER_CONTAINER);
  }

  render() {
    return this.controller(
      "Mrz Scanner",
      "",
      () => {
        this.onCameraSwap(ScanbotSdkService.instance.mrzScanner!, true);
      },
      () => {
        this.onCameraSwitch(ScanbotSdkService.instance.mrzScanner!);
      }
    );
  }

  onMrzsDetected(result: MrzResult) {
    this.props.onMrzsDetected(result);
  }

  async componentDidMount() {
    super.componentDidMount();
    try {
      await ScanbotSdkService.instance.createMrzScanner(
        this.onMrzsDetected.bind(this),
        this.onScannerError.bind(this)
      );
    } catch (e: any) {
      this.onScannerError(e);
    }
  }

  componentWillUnmount() {
    ScanbotSdkService.instance.disposeMrzScanner();
  }
}

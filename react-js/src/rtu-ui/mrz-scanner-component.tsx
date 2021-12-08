import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";

export default class MrzScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.MRZ_SCANNER_CONTAINER,
      "Mrz Scanner",
      ""
    );
  }

  onMrzsDetected(result: MrzResult) {
    this.props.onMrzsDetected(result);
  }

  onMrzScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.pop();
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      await ScanbotSdkService.instance.createMrzScanner(
        this.onMrzsDetected.bind(this),
        this.onMrzScannerError.bind(this)
      );
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeMrzScanner();
    });
  }
}

import { TextDataScannerResult } from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";

export default class TextDataScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER,
      "Text Data Scanner",
      "",
      () => {
        ScanbotSdkService.instance.textDataScanner?.swapCameraFacing(true);
      }
    );
  }

  onTextDataDetected(result: TextDataScannerResult) {
    this.props.onTextDataDetected(result);
  }

  onTextDataScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.pop();
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      await ScanbotSdkService.instance.createTextDataScanner(
        this.onTextDataDetected.bind(this),
        this.onTextDataScannerError.bind(this)
      );
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeTextDataScanner();
    });
  }
}

import { TextPatternScannerResult } from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";
import { MiscUtils } from "../utils/misc-utils";

export default class TextPatternScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER,
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

  onTextDataDetected(result: TextPatternScannerResult) {
    this.props.onTextDataDetected(result);
  }

  onTextDataScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    MiscUtils.alert(e.name + ': ' + e.message);
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      try {
        await ScanbotSdkService.instance.createTextPatternScanner(
          this.onTextDataDetected.bind(this),
          this.onTextDataScannerError.bind(this)
        );
      } catch (e: any) {
        this.onTextDataScannerError(e);
        this.pop()
      }
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeTextDataScanner();
    });
  }
}

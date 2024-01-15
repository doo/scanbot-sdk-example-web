import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";
import { MiscUtils } from "../utils/misc-utils";

export default class MrzScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.MRZ_SCANNER_CONTAINER,
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

  onMrzScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    MiscUtils.alert(e.name + ': ' + e.message);
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      try {
        await ScanbotSdkService.instance.createMrzScanner(
          this.onMrzsDetected.bind(this),
          this.onMrzScannerError.bind(this)
        );
      } catch (e) {
        this.onMrzScannerError(e);
        this.pop()
      }
    });
  }

  pop() {
    super.pop();
    this.updateAnimationType(AnimationType.Pop, () => {
      ScanbotSdkService.instance.disposeMrzScanner();
    });
  }
}

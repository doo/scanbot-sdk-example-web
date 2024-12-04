import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";
import { MiscUtils } from "../utils/misc-utils";
import { MrzScannerResult } from "scanbot-web-sdk/@types";

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

  onMrzsDetected(result: MrzScannerResult) {
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
        this.onMrzScannerError(e as any);
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

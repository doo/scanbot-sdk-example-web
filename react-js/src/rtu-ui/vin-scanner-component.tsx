import { TextDataScannerResult } from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";

export default class VINScannerComponent extends BaseScannerComponent {
  render() {
    return this.controller(
      ScanbotSdkService.VIN_SCANNER_CONTAINER,
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

  onTextDataDetected(result: TextDataScannerResult) {
    this.props.onTextDataDetected(result);
  }

  onTextDataScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
  }

  async push(type: AnimationType) {
    super.push(type);
    this.pushType = type;
    this.updateAnimationType(type, async () => {
      try {
        await ScanbotSdkService.instance.createVINScanner(
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


import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import BaseScannerComponent from "./common/base-scanner-component";
import { AnimationType } from "./enum/animation-type";

export default class MrzScannerComponent extends BaseScannerComponent {

    render() {
        return this.controller(ScanbotSdkService.MRZ_SCANNER_CONTAINER, "Mrz Scanner", '');
    }

    onMrzsDetected(result: MrzResult) {
        this.props.onMrzsDetected(result);
    }

    onError() {
        this.props.onError();
    }

    async push(type: AnimationType) {
        super.push(type);
        this.pushType = type;
        this.updateAnimationType(type, async () => {
            await ScanbotSdkService.instance.createMrzScanner(this.onMrzsDetected.bind(this), this.onError.bind(this));
        });
    }

    pop() {
        super.pop();
        this.updateAnimationType(AnimationType.Pop, () => {
            ScanbotSdkService.instance.disposeMrzScanner();
        });
    }
}

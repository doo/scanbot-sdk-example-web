
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentDetectionResult} from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import {AnimationType} from "./enum/animation-type";
import Pages from "../model/pages";

export default class DocumentScannerComponent extends BaseScannerComponent {

    render() {
        return this.controller(ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER, "Document Scanner", this.labelText());
    }

    onDocumentDetected(result: DocumentDetectionResult) {
        this.props.onDocumentDetected(result);
        document.getElementById("count-label")!.innerHTML = this.labelText();
    }

    labelText() {
        return Pages.instance.count() + " Pages";
    }

    async push(type: AnimationType) {
        this.pushType = type;
        this.updateAnimationType(type, async () => {
            await ScanbotSdkService.instance.createDocumentScanner(this.onDocumentDetected.bind(this));
        });
    }

    pop() {
        this.updateAnimationType(AnimationType.Pop, () => {
            ScanbotSdkService.instance.disposeDocumentScanner();
        });
    }
}

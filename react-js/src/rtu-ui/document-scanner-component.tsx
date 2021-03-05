import React from "react";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentDetectionResult} from "scanbot-web-sdk/@types";
import BaseScannerComponent from "./common/base-scanner-component";
import {AnimationType} from "./enum/animation-type";

export default class DocumentScannerComponent extends BaseScannerComponent {

    render() {
        return this.controller(ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER, "Document Scanner");
    }

    onDocumentDetected(result: DocumentDetectionResult) {
        console.log("Detected", result);
    }

    async push(type: AnimationType) {
        this.pushType = type;
        this.updateAnimationType(type, async () => {
            await ScanbotSdkService.instance.createDocumentScanner(this.onDocumentDetected);
        });
    }

    pop() {
        this.updateAnimationType(AnimationType.Pop, () => {
            ScanbotSdkService.instance.disposeDocumentScanner();
        });
    }
}


import React from "react";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types";
import Swal from "sweetalert2";

export default class CheckScannerPage extends React.Component<any, any> {

    async componentDidMount(): Promise<void> {
        await ScanbotSdkService.instance.createDocumentScanner(
            async (result: DocumentDetectionResult) => {
                // Flash on recognition just to give the user some visual feedback that something was detected
                ScanbotSdkService.instance.sdk?.utils.flash();
                // If a cropped image exists, use that, otherwise use the original
                const checkResult = await ScanbotSdkService.instance.recognizeCheck(result.cropped ?? result.original);
                const check = checkResult.check;
                const fieldString = check.fields.map((field) => {
                    return `${field.type.name}: ${field.value.text}`;
                });

                await Swal.fire({
                    title: check.type.name,
                    text: fieldString.join("\n"),
                });
            },
            () => {
                // Handle errors
                ScanbotSdkService.instance.disposeDocumentScanner();
            },
        );
    }

    componentWillUnmount(): void {
        ScanbotSdkService.instance.disposeDocumentScanner();
    }

    render() {
        return (
            <div style={{ height: "100%" }}>
                <div
                    id={ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER}
                    style={{ width: "100%", height: "100%" }}
                />
            </div>
        );
    }
}

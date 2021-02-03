
import React from "react";
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";

export default class DocumentScannerPage extends React.Component<any, any>{

    SCANNER_CONTAINER = "document-scanner-view";

    documentScanner?: IDocumentScannerHandle;

    async componentDidMount(): Promise<void> {
        const config: DocumentScannerConfiguration = {
            onDocumentDetected: this.onDocumentDetected.bind(this),
            containerId: this.SCANNER_CONTAINER
        };

        if (this.props.sdk) {
            this.documentScanner = await this.props.sdk.createDocumentScanner(config);
        }
    }

    async onDocumentDetected(result: DetectionResult) {
        console.log("Detected document: ", result);
        const image = result.cropped ?? result.original;
        this.documentScanner?.dispose();
        // const config: CroppingViewConfiguration = {
        //     image: image,
        //     polygon: result.polygon,
        //     containerId: this.SCANNER_CONTAINER
        // };
        // this.croppingView = await props.sdk?.openCroppingView(config);
    }

    render() {
        return (
            <div style={{height: "100vh"}}>
                <div id={this.SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
            </div>
        );
    }
}

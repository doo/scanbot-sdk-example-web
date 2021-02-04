
import React from "react";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";

export default class DocumentScannerPage extends React.Component<any, any>{

    SCANNER_CONTAINER = "document-scanner-view";

    documentScanner?: IDocumentScannerHandle;

    async componentDidMount(): Promise<void> {
        const config: DocumentScannerConfiguration = {
            onDocumentDetected: this.props.onDocumentDetected,
            containerId: this.SCANNER_CONTAINER
        };

        if (this.props.sdk) {
            this.documentScanner = await this.props.sdk.createDocumentScanner(config);
        }
    }

    componentWillUnmount(): void {
        this.documentScanner?.dispose();
    }

    render() {
        return (
            <div style={{height: "100%"}}>
                <div id={this.SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
            </div>
        );
    }
}

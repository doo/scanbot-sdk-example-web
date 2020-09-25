import React from 'react';
import './App.css';

import ScanbotSDK from "scanbot-web-sdk/webpack";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/component/model/document-scanner-configuration";

export default class App extends React.Component<any, any> {

    SCANNER_CONTAINER = "document-scanner-view";
    license = "";
    SDK: ScanbotSDK | undefined;

    constructor(props: any) {
        super(props);
    }

    async componentDidMount() {
        this.SDK = await ScanbotSDK.initialize({
            licenseKey: this.license,
            engine: "/"
        });

        if (!this.SDK.initialized) {
            const info = await this.SDK.getLicenseInfo();
            console.log("Something went wrong. Here's your license info:", info);
            return;
        }

        const configuration: DocumentScannerConfiguration = {
            onDocumentDetected: async (result: any) => {
                console.log("Detected document:", result);
            },
            containerId: this.SCANNER_CONTAINER
        };

        await this.SDK.createDocumentScanner(configuration);
    }

    render() {
        return (
            <div className="App">
                <div id={this.SCANNER_CONTAINER} style={{width: "96vw", height: "90vh", padding: "1vh"}}/>
            </div>
        );
    }
}

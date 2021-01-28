import React from 'react';
import './App.css';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";

export default class App extends React.Component<any, any> {

    SCANNER_CONTAINER = "document-scanner-view";
    license = "";
    SDK: ScanbotSDK | undefined;

    documentScanner?: IDocumentScannerHandle;
    croppingView?: ICroppingViewHandle;

    constructor(props: any) {
        super(props);
        this.state = {
            image: undefined,
            configuration: {
                scanner: undefined,
                cropping: undefined
            }
        };
    }

    async componentDidMount() {
        this.SDK = await ScanbotSDK.initialize({licenseKey: this.license, engine: "/"});

        if (!this.SDK.initialized) {
            const info = await this.SDK.getLicenseInfo();
            console.log("Something went wrong. Here's your license info:", info);
            return;
        }

        const config: DocumentScannerConfiguration = {
            onDocumentDetected: this.onDocumentDetected.bind(this),
            containerId: this.SCANNER_CONTAINER
        };

        this.documentScanner = await this.SDK.createDocumentScanner(config);
    }

    async onDocumentDetected(result: DetectionResult) {
        console.log("Detected document: ", result);
        const image = result.cropped ?? result.original;
        this.documentScanner?.dispose();
        const config: CroppingViewConfiguration = {
            image: image,
            polygon: result.polygon,
            containerId: this.SCANNER_CONTAINER
        };
        this.croppingView = await this.SDK?.openCroppingView(config);
    }

    render() {
        return (
            <div>
                <AppBar position="fixed">
                    <Toolbar><Typography variant="h6">Scanbot Web SDK Example</Typography></Toolbar>
                </AppBar>
                <div style={{height: "100vh"}}>
                    <div id={this.SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>
                </div>
            </div>
        );
    }

    closePopup() {
        this.setState({image: undefined});
    }
}

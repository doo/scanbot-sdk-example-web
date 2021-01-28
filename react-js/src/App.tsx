import React from 'react';
import './App.css';
import {AppBar, Toolbar, Typography} from "@material-ui/core";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from the component folder
import {DocumentScannerConfiguration} from "scanbot-web-sdk/component/model/configuration/document-scanner-configuration";
import DocumentScannerView from "scanbot-web-sdk/component/document-scanner-view";
import {DetectionResult} from "scanbot-web-sdk/component/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/component/model/configuration/cropping-view-configuration";
import CroppingView from "scanbot-web-sdk/component/cropping-view";

export default class App extends React.Component<any, any> {

    SCANNER_CONTAINER = "document-scanner-view";
    license = "";
    SDK: ScanbotSDK | undefined;

    document: any;

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

        const scanner: DocumentScannerConfiguration = {
            onDocumentDetected: async (result: DetectionResult) => {
                console.log("Detected document: ", result);
                const image = result.cropped ?? result.original;
                this.setState({
                    image: await this.SDK?.toDataUrl(image),
                    configuration: {
                        ...scanner,
                        cropping: {image: image, polygon: result.polygon}
                    }
                });
            },

        };

        this.setState({configuration: {scanner: scanner}});
    }

    render() {
        return (
            <div>
                <AppBar position="fixed">
                    <Toolbar><Typography variant="h6">Scanbot Web SDK Example</Typography></Toolbar>
                </AppBar>
                <div style={{height: "100vh"}}>
                    {this.decideContent()}
                </div>
            </div>
        );
    }

    decideContent() {
        if (this.state.image) {
            return <CroppingView configuration={this.state.configuration.cropping}/>;
        }

        if (this.state.configuration.scanner) {
            return <DocumentScannerView configuration={this.state.configuration.scanner}/>
        }
        // this.state.image && <Lightbox mainSrc={this.state.image} onCloseRequest={this.closePopup.bind(this)}/>}
    }
    closePopup() {
        this.setState({image: undefined});
    }
}

import React from 'react';
import {AppBar, Snackbar, Toolbar} from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";
import FeatureList from "./subviews/FeatureList";
import {HashRouter, Route, Routes} from "react-router-dom";
import DocumentScannerPage from "./pages/document-scanner-page";
import ImageResultsPage from "./pages/image-results-page";
import {FeatureId} from "./model/Features";

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class App extends React.Component<any, any> {

    SCANNER_CONTAINER = "document-scanner-view";
    license = "";
    SDK: ScanbotSDK | undefined;

    documentScanner?: IDocumentScannerHandle;
    croppingView?: ICroppingViewHandle;

    constructor(props: any) {
        super(props);
        this.state = {
            alert: undefined,
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

        // this.documentScanner = await this.SDK.createDocumentScanner(config);
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

    onAlertClose() {
        this.setState({alert: undefined});
    }

    render() {
        return (
            <div>
                <Snackbar open={!!this.state.alert} autoHideDuration={2000} onClose={this.onAlertClose.bind(this)}>
                    <Alert onClose={this.onAlertClose.bind(this)} severity={this.state.alert?.color}>
                        {this.state.alert?.text}
                    </Alert>
                </Snackbar>
                <AppBar position="fixed">
                    <Toolbar>SCANBOT WEB SDK EXAMPLE</Toolbar>
                </AppBar>
                {/*<div style={{height: "100vh"}}>*/}
                {/*    <div id={this.SCANNER_CONTAINER} style={{width: "100%", height: "100%"}}/>*/}
                {/*</div>*/}
                <HashRouter>
                <Routes>
                    <Route path="/" element={<FeatureList onItemClick={this.onFeatureClick.bind(this)}/>}/>
                    <Route path="/document-scanner" element={<DocumentScannerPage/>}/>
                    <Route path="/image-results" element={<ImageResultsPage/>}/>
                </Routes>
                </HashRouter>
            </div>
        );
    }

    async onFeatureClick(feature: any) {
        if (feature.route) {
            // Features with their own routes have links. This is only for handling other click events
            return;
        }

        if (feature.id === FeatureId.LicenseInfo) {
            const info = await this.SDK?.getLicenseInfo();
            const color = (info?.status === "Trial") ? "success" : "error";
            this.setState({alert: {color: color, text: JSON.stringify(info)}});
        } else if (feature.id === FeatureId.ImagePicker) {

        }

    }
}


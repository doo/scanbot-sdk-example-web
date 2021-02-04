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
import {createBrowserHistory} from "history";

const history = createBrowserHistory();

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default class App extends React.Component<any, any> {

    license = "";

    croppingView?: ICroppingViewHandle;

    constructor(props: any) {
        super(props);
        this.state = {
            alert: undefined,
            image: undefined,
            sdk: undefined
        };
    }

    async componentDidMount() {
        const sdk = await ScanbotSDK.initialize({licenseKey: this.license, engine: "/"});
        this.setState({sdk: sdk});

        history.listen(update => {
            this.forceUpdate();
        })
    }

    onAlertClose() {
        this.setState({alert: undefined});
    }

    isAtRoot() {
        return window.location.hash === "#/";
    }
    onBackPress() {
        history.back();
    }

    render() {
        return (
            <div>
                <Snackbar open={!!this.state.alert} autoHideDuration={2000} onClose={this.onAlertClose.bind(this)}>
                    <Alert onClose={this.onAlertClose.bind(this)} severity={this.state.alert?.color}>
                        {this.state.alert?.text}
                    </Alert>
                </Snackbar>
                <AppBar position="fixed" style={{display: "flex", flexDirection: "row"}}>
                    {!this.isAtRoot() && <button onClick={() => this.onBackPress()}>Back</button>}
                    <Toolbar>SCANBOT WEB SDK EXAMPLE</Toolbar>
                </AppBar>
                <HashRouter>
                <Routes>
                    <Route path="/" element={<FeatureList onItemClick={this.onFeatureClick.bind(this)}/>}/>
                    <Route path="/document-scanner" element={<DocumentScannerPage sdk={this.state.sdk}/>}/>
                    <Route path="/image-results" element={<ImageResultsPage/>}/>
                </Routes>
                </HashRouter>
            </div>
        );
    }

    async onFeatureClick(feature: any) {
        if (feature.route) {
            // Features with their own routes have links. This is only for handling other click events.
            // However, do refresh the UI to ensure correct back button behavior
            this.forceUpdate();
            return;
        }

        if (feature.id === FeatureId.LicenseInfo) {
            const info = await this.state.sdk?.getLicenseInfo();
            const color = (info?.status === "Trial") ? "success" : "error";
            this.setState({alert: {color: color, text: JSON.stringify(info)}});
        } else if (feature.id === FeatureId.ImagePicker) {

        }

    }
}


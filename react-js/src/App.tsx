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
import ImageDetailPage from "./pages/image-detail-page";
import {BottomBar} from "./subviews/BottomBar";
import Pages from "./model/Pages";
import CroppingPage from "./pages/cropping-page";

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
            console.log("listening to history ", update);
            this.forceUpdate();
        });
    }

    onAlertClose() {
        this.setState({alert: undefined});
    }

    ROOT_HASH = "#/";
    isAtRoot() {
        return window.location.hash === this.ROOT_HASH || window.location.hash === "";
    }
    onBackPress() {
        history.back();
    }

    navigation?: any;

    toolbarHeight() {
        return (this.navigation as HTMLHeadingElement)?.clientHeight ?? 0;
    }
    containerHeight() {
        if (!this.navigation) {
            return "100%";
        }
        return (window.innerHeight - 2 * this.toolbarHeight()) ?? 0;
    }

    findRoute() {
        const route = window.location.hash?.replace(this.ROOT_HASH, "");
        if (route) {
            const split = route.split("?");
            if (split.length > 0) {
                return split[0];
            }
        }
        return undefined;
    }
    private addButtonsBasedOnRoute() {
        const route = this.findRoute();
        if (route === FeatureId.DocumentScanner) {
            return [
                {text: Pages.instance.count() + " PAGES", action: undefined},
                {text: "DONE", action: () => {this.onBackPress()}, right: true}
            ];
        }
        if (route === FeatureId.ImageResults) {
            return [
                {text: "SAVE PDF", action: () => {}},
                {text: "DELETE", action: () => {}, right: true}
            ];
        }
        if (route === FeatureId.ImageDetails) {
            return [
                {text: "CROP", action: () => {
                    const path = "#/" + FeatureId.CroppingView + "?index=" + Pages.instance.getActiveIndex();
                    history.push(path);
                }},
                {text: "FILTER", action: () => {}}
            ];
        }
        if (route == FeatureId.CroppingView) {
            return [
                {text: "DETECT", action: () => {}},
                {text: "ROTATE", action: () => {}},
                {text: "APPLY", action: () => {}, right: true}
            ]
        }
    }
    render() {
        return (
            <div>
                <Snackbar open={!!this.state.alert} autoHideDuration={2000} onClose={this.onAlertClose.bind(this)}>
                    <Alert onClose={this.onAlertClose.bind(this)} severity={this.state.alert?.color}>
                        {this.state.alert?.text}
                    </Alert>
                </Snackbar>

                <AppBar position="fixed" style={{display: "flex", flexDirection: "row"}}
                        ref={ref => this.navigation = ref}>
                    {!this.isAtRoot() && <button style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "white",
                        width: "50px",
                        fontSize: "30px",
                        textAlign: "center"
                    }} onClick={() => this.onBackPress()} dangerouslySetInnerHTML={{__html: "&#8249"}}/>}
                    <Toolbar>SCANBOT WEB SDK EXAMPLE</Toolbar>
                </AppBar>
                <div style={{height: this.containerHeight(), marginTop: this.toolbarHeight()}}>
                    {this.decideContent()}
                </div>
                <BottomBar hidden={this.isAtRoot()} style={{height: this.toolbarHeight()}}
                           buttons={this.addButtonsBasedOnRoute()}
                />
            </div>
        );
    }
    decideContent() {
        const route = this.findRoute();
        console.log("route", route);
        if (this.isAtRoot()) {
            return <FeatureList onItemClick={(feature: any) => {
                if (feature.route) {
                    history.push("#/" + feature.route);
                }
            }}/>
        }
        if (route == FeatureId.DocumentScanner) {
            return <DocumentScannerPage sdk={this.state.sdk}
                                        onDocumentDetected={this.onDocumentDetected.bind(this)}/>;
        }
        if (route === FeatureId.CroppingView) {
            return <CroppingPage sdk={this.state.sdk}/>;
        }
        if (route === FeatureId.ImageDetails) {
            return <ImageDetailPage sdk={this.state.sdk}/>
        }
        if (route === FeatureId.ImageResults) {
            return <ImageResultsPage
                sdk={this.state.sdk}
                onDetailButtonClick={(index: number) => {
                    Pages.instance.setActiveItem(index);
                    history.push("#/image-details?index=" + index);
                }}/>
        }
    }
    async onDocumentDetected(result: DetectionResult) {
        Pages.instance.add(result);
        this.forceUpdate();
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

        } else {

        }

    }
}


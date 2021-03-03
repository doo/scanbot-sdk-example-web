
import React from 'react';
import {AppBar} from "@material-ui/core";
import Swal from "sweetalert2";

import {
    ImageFilter,
    BarcodeResult,
    Barcode
} from "scanbot-web-sdk/@types";

import {NavigationContent} from "./subviews/navigation-content";
import {Toast} from "./subviews/toast";
import FeatureList from "./subviews/feature-list";
import {BottomBar} from "./subviews/bottom-bar";

import DocumentScannerPage from "./pages/document-scanner-page";
import ImageResultsPage from "./pages/image-results-page";
import ImageDetailPage from "./pages/image-detail-page";
import CroppingPage from "./pages/cropping-page";
import BarcodeScannerPage from "./pages/barcode-scanner-page";

import Pages from "./model/pages";
import {ScanbotSdkService} from "./service/scanbot-sdk-service";
import {RoutePath, RoutingService} from "./service/routing-service";

import {ImageUtils} from "./utils/image-utils";
import {NavigationUtils} from "./utils/navigation-utils";
import {MiscUtils} from "./utils/misc-utils";
import DocumentScannerComponent from "./rtu-ui/document-scanner-component";

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            alert: undefined,
            activeImage: undefined,
            sdk: undefined
        };
    }

    async componentDidMount() {
        const sdk = await ScanbotSdkService.instance.initialize();
        this.setState({sdk: sdk});

        RoutingService.instance.observeChanges(() => {
            this.forceUpdate();
        })
    }

    onBackPress() {
        RoutingService.instance.back();
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

    render() {
        return (
            <div>
                {this.documentScanner()}
                <input className="file-picker" type="file" accept="image/jpeg" width="48"
                       height="48" style={{display: "none"}}/>
                <Toast alert={this.state.alert} onClose={() => this.setState({alert: undefined})}/>

                <AppBar position="fixed" ref={ref => this.navigation = ref}>
                    <NavigationContent backVisible={!NavigationUtils.isAtRoot()} onBackClick={() => this.onBackPress()}/>
                </AppBar>
                <div style={{height: this.containerHeight(), marginTop: this.toolbarHeight()}}>
                    {this.decideContent()}
                </div>
                <BottomBar hidden={NavigationUtils.isAtRoot()} height={this.toolbarHeight()} buttons={this.decideButtons()}/>
            </div>
        );
    }

    documentScanner() {
        const route = NavigationUtils.findRoute();
        if (route === RoutePath.DocumentScanner) {
            return <DocumentScannerComponent sdk={this.state.sdk} onDocumentDetected={this.onDocumentDetected.bind(this)}/>;
        }
        return null;
    }
    decideContent() {
        const route = NavigationUtils.findRoute();
        if (NavigationUtils.isAtRoot()) {
            return <FeatureList onItemClick={this.onFeatureClick.bind(this)}/>
        } else {
            return null;
        }

        if (route === RoutePath.DocumentScanner) {
            return <DocumentScannerPage sdk={this.state.sdk} onDocumentDetected={this.onDocumentDetected.bind(this)}/>;
        }

        if (route === RoutePath.BarcodeScanner) {
            return <BarcodeScannerPage sdk={this.state.sdk} onBarcodesDetected={this.onBarcodesDetected.bind(this)}/>;
        }
        if (route === RoutePath.CroppingView) {
            if (!Pages.instance.hasActiveItem()) {
                RoutingService.instance.reset();
                return null;
            }
            return <CroppingPage sdk={this.state.sdk}/>;
        }

        if (route === RoutePath.ImageDetails) {
            if (!Pages.instance.hasActiveItem()) {
                RoutingService.instance.reset();
                return null;
            }
            return <ImageDetailPage image={this.state.activeImage}/>
        }
        if (route === RoutePath.ImageResults) {
            return <ImageResultsPage
                sdk={this.state.sdk}
                onDetailButtonClick={async (index: number) => {
                    Pages.instance.setActiveItem(index);
                    this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
                    RoutingService.instance.route(RoutePath.ImageDetails, {index: index})
                }}/>
        }
    }

    private decideButtons() {
        const route = NavigationUtils.findRoute();
        if (route === RoutePath.DocumentScanner) {
            return [
                {text: Pages.instance.count() + " PAGES", action: undefined},
                {text: "DONE", action: this.onBackPress.bind(this), right: true}
            ];
        }
        if (route === RoutePath.ImageResults) {
            return [
                {text: "SAVE PDF", action: this.savePDF.bind(this)},
                {text: "SAVE TIFF", action: this.saveTIFF.bind(this)}
            ];
        }
        if (route === RoutePath.ImageDetails) {
            return [
                {text: "CROP", action: this.openCroppingUI.bind(this)},
                {text: "FILTER", action: this.applyFilter.bind(this)},
                {text: "DELETE", action: this.deletePage.bind(this), right: true}
            ];
        }

        if (route === RoutePath.CroppingView) {
            return [
                {text: "DETECT", action: this.detect.bind(this)},
                {text: "ROTATE", action: this.rotate.bind(this)},
                {text: "APPLY", action: this.applyCrop.bind(this), right: true}
            ]
        }
    }

    async detect() {
        await ScanbotSdkService.instance.croppingView?.detect();
    }

    async rotate() {
        await ScanbotSdkService.instance.croppingView?.rotate(1);
    }

    async applyCrop() {
        const result = await ScanbotSdkService.instance.croppingView?.apply();
        Pages.instance.updateActiveItem(result);
        await ScanbotSdkService.instance.reapplyFilter();
        this.onBackPress();
        const index = Pages.instance.getActiveIndex();
        this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
    }

    async savePDF() {
        const bytes = await ScanbotSdkService.instance.generatePDF(Pages.instance.get());
        ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".pdf");
    }
    async saveTIFF() {
        const bytes = await ScanbotSdkService.instance.generateTIFF(Pages.instance.get());
        ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".tiff");
    }

    openCroppingUI() {
        RoutingService.instance.route(RoutePath.CroppingView, {index: Pages.instance.getActiveIndex()});
    }

    async applyFilter() {
        const page = Pages.instance.getActiveItem();
        const result = await Swal.fire({
            title: 'Select filter',
            input: 'select',
            inputOptions: ScanbotSdkService.instance.availableFilters(),
            inputPlaceholder: page.filter ?? "none"
        });

        const filter = ScanbotSdkService.instance.filterByIndex(result.value);

        // "None" is not an actual filter, only used in this example app
        if (filter === "none") {
            page.filter = undefined;
            page.filtered = undefined;
        } else {
            page.filter = filter;
            page.filtered = await ScanbotSdkService.instance.applyFilter(
                page.cropped ?? page.original,
                filter as ImageFilter);
        }

        const index = Pages.instance.getActiveIndex();
        this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
    }

    deletePage() {
        Pages.instance.removeActiveItem();
        RoutingService.instance.route(RoutePath.ImageResults);
    }

    async onDocumentDetected(result: any) {
        Pages.instance.add(result);
        this.forceUpdate();
    }

    async onBarcodesDetected(result: BarcodeResult) {
        console.log("detected", result);

        // If you have any additional processing to do, consider pausing
        // the scanner here, else you might (will) receive multiple results:
        // ScanbotSdkService.instance.barcodeScanner?.pauseDetection();
        this.setState({alert: {color: "success", text: this.formatBarcodes(result.barcodes)}});
    }

    formatBarcodes(codes: Barcode[]): string {
        return JSON.stringify(codes.map((code: Barcode) => code.text + " (" + code.format + ") "));
    }

    async onFeatureClick(feature: any) {
        if (feature.route) {
            // history.push("#/" + feature.route);
            RoutingService.instance.route(feature.route);
            return;
        }

        if (feature.id === RoutePath.LicenseInfo) {
            const info = await this.state.sdk?.getLicenseInfo();
            const color = (info?.status === "Trial") ? "success" : "error";
            this.setState({alert: {color: color, text: JSON.stringify(info)}});
        } else if (feature.id === RoutePath.ImagePicker) {
            const result = await ImageUtils.pick();
            Pages.instance.add(result)
        }

    }
}


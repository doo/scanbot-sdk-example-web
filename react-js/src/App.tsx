import React from 'react';
import {AppBar} from '@material-ui/core';
import Swal from 'sweetalert2';

import { Barcode, BarcodeResult, ImageFilter } from 'scanbot-web-sdk/@types';

import NavigationContent from './subviews/navigation-content';
import { Toast } from './subviews/toast';
import FeatureList from './subviews/feature-list';
import { BottomBar } from './subviews/bottom-bar';

import ImageResultsPage from './pages/image-results-page';
import ImageDetailPage from './pages/image-detail-page';
import CroppingPage from './pages/cropping-page';

import Pages from './model/pages';
import { ScanbotSdkService } from './service/scanbot-sdk-service';
import { RoutePath, RoutingService } from './service/routing-service';

import { ImageUtils } from './utils/image-utils';
import { NavigationUtils } from './utils/navigation-utils';
import { MiscUtils } from './utils/misc-utils';
import DocumentScannerComponent from './rtu-ui/document-scanner-component';
import { AnimationType } from './rtu-ui/enum/animation-type';
import BarcodeScannerComponent from './rtu-ui/barcode-scanner-component';
import Barcodes from './model/barcodes';
import ErrorLabel from './subviews/error-label';
import Onboarding from './pages/onboarding/onboarding-carousel';
import LoadingScreen from "./subviews/loading-screen";
import {StorageService} from "./service/storage-service";

import MainMenu from './pages/main-menu/main-menu';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import DocumentScannerPage from './pages/document-scanner-page';
import BaseScannerComponent from './rtu-ui/common/base-scanner-component';

export default class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            alert: undefined,
            activeImage: undefined,
            sdk: undefined,
            error: {
                message: undefined
            },
            loading: true,
            language: this.languageOrDefault(),
            showOnboarding: !StorageService.instance.getHasVisited(),
        };
    }

    async componentDidMount() {
        const sdk = await ScanbotSdkService.instance.initialize();
        this.setState({sdk: sdk, loading: false});

        RoutingService.instance.observeChanges(() => {
            this.forceUpdate();
        });

        await ScanbotSdkService.instance.setLicenseFailureHandler((error: any) => {
            RoutingService.instance.reset();
            this.setState({error: {message: error}});
            if (this._documentScanner?.isVisible()) {
                this._documentScanner?.pop();
            }
            if (this._barcodeScanner?.isVisible()) {
                this._barcodeScanner?.pop();
            }

        });
    }

    languageOrDefault(): string {
		const split = window.location.href.split('?lang=');
		if (split.length > 1) {
			return split[1];
		}
		return 'en';
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

        const mainMenuProps = {
            language: this.state.language,
            pageCount: Pages.instance.count(),
            callDocument: () => this._documentScanner?.push(AnimationType.PushRight),
            callBarcode: () => this._barcodeScanner?.push(AnimationType.PushBottom),
            viewDocuments: null,
        }

        return (
            <>
                                {this.documentScanner()}
                {this.barcodeScanner()}
                <Link to='/doc-scanner'>Teste</Link>
                <Link to='/view-doc'>View</Link>
                <Switch>
                    <Route path='/welcome'>
                        <Onboarding skip={() => {
                            StorageService.instance.setHasVisited();
                            this.setState({showOnboarding: false}); 
                            }} 
                            language={this.state.language}    
                        />
                    </Route>
                    <Route exact path="/">
                        {this.state.showOnboarding 
                            ? <Redirect to='/welcome'/> 
                            : <MainMenu {...mainMenuProps}/>
                        }
                    </Route>
                    <Route path="/doc-scanner">
                        <DocumentScannerPage />
                    </Route>
                    <Route path="/view-doc">
                        <ImageResultsPage
                            sdk={this.state.sdk}
                            onDetailButtonClick={async (index: number) => {
                                Pages.instance.setActiveItem(index);
                                this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
                                RoutingService.instance.route(RoutePath.ImageDetails, {index: index});
                        }}/>
                    </Route>
                    <Route path="/img-detail">
                        <ImageDetailPage image={this.state.activeImage}/>
                    </Route>
                </Switch>

                {/* {this.documentScanner()}
                {this.barcodeScanner()}

                <Toast alert={this.state.alert} onClose={() => this.setState({alert: undefined})}/>

                <AppBar ref={ref => this.navigation = ref} style={{zIndex: 19}}>
                    <NavigationContent backVisible={!NavigationUtils.isAtRoot()}
                                       onBackClick={() => this.onBackPress()}/>
                </AppBar>

                <div style={{height: this.containerHeight(), marginTop: this.toolbarHeight()}}>
                    {this.decideContent()}
                </div>
                <BottomBar
                    hidden={NavigationUtils.isAtRoot()}
                    height={this.toolbarHeight()}
                    buttons={this.decideButtons()}
                />
                <LoadingScreen isVisible={this.state.loading}/> */}
            </>
        );
    }

    // testing

    

    // --------------

    _documentScannerHtmlComponent: any;
    _documentScanner?: DocumentScannerComponent | null;
    documentScanner() {
        if (!this._documentScannerHtmlComponent) {
            this._documentScannerHtmlComponent = <DocumentScannerComponent
                ref={ref => this._documentScanner = ref}
                sdk={this.state.sdk}
                onDocumentDetected={this.onDocumentDetected.bind(this)}
            />;
        }
        return this._documentScannerHtmlComponent;
    }

    _barcodeScannerHtmlComponent: any;
    _barcodeScanner?: BarcodeScannerComponent | null;
    barcodeScanner() {
        if (!this._barcodeScannerHtmlComponent) {
            this._barcodeScannerHtmlComponent = <BarcodeScannerComponent
                ref={ref => this._barcodeScanner = ref}
                sdk={this.state.sdk}
                onBarcodesDetected={this.onBarcodesDetected.bind(this)}
            />;
        }
        return this._barcodeScannerHtmlComponent
    }

    decideContent() {
        const route = NavigationUtils.findRoute();

        if (NavigationUtils.isAtRoot() || route === RoutePath.DocumentScanner || route === RoutePath.BarcodeScanner) {
            return <div>
                <ErrorLabel message={this.state.error.message}/>
                <FeatureList onItemClick={this.onFeatureClick.bind(this)} onPick={this.onFilePicked.bind(this)}
                             onError={this.onError.bind(this)}/>
            </div>
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
        ScanbotSdkService.instance.sdk?.utils.flash();
        Pages.instance.add(result);
    }

    async onBarcodesDetected(result: BarcodeResult) {
        Barcodes.instance.addAll(result.barcodes);
        // If you have any additional processing to do, consider pausing
        // the scanner here, else you might (will) receive multiple results:
        // ScanbotSdkService.instance.barcodeScanner?.pauseDetection();
        this.setState({alert: {color: "success", text: this.formatBarcodes(result.barcodes), autoClose: true}});
    }

    formatBarcodes(codes: Barcode[]): string {
        return JSON.stringify(codes.map((code: Barcode) => code.text + " (" + code.format + ") "));
    }

    async onError(message: string) {
        this.setState({alert: {color: "error", text: message, autoClose: true}});
    }

    async onFilePicked(feature: any, data: any) {

        if (feature.id === RoutePath.DocumentOnJpeg) {
            console.log("data", data);
            const result = {original: new Uint8Array(data)};
            Pages.instance.add(result)
        }

        if (feature.id === RoutePath.BarcodeOnJpeg) {
            const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(data);
            if (detection !== undefined) {
                this.setState({
                    alert: {
                        color: "success",
                        text: this.formatBarcodes(detection.barcodes),
                        autoClose: false
                    }
                });
            }
        }

        if (feature.id === RoutePath.BarcodeOnPdf) {
            const images = await ImageUtils.pdfToImage(data);
            const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(images[0]);
            if (detection !== undefined) {
                this.setState({
                    alert: {
                        color: "success",
                        text: this.formatBarcodes(detection.barcodes),
                        autoClose: false
                    }
                });
            }

        }
    }

    async onFeatureClick(feature: any) {

        const valid = await ScanbotSdkService.instance.isLicenseValid();
        if (!valid) {
            console.error("License invalid or expired. ScanbotSDK features not available");
            return;
        }

        if (feature.id === RoutePath.DocumentScanner) {
            this._documentScanner?.push(AnimationType.PushRight);
            return;
        }
        if (feature.id === RoutePath.BarcodeScanner) {
            this._barcodeScanner?.push(AnimationType.PushBottom);
            return;
        }
        if (feature.route) {
            RoutingService.instance.route(feature.route);
            return;
        }

        if (feature.id === RoutePath.LicenseInfo) {
            const info = await this.state.sdk?.getLicenseInfo();
            const color = (info?.status === "Trial") ? "success" : "error";
            this.setState({alert: {color: color, text: JSON.stringify(info)}});
        } else if (feature.id === RoutePath.DocumentOnJpeg) {
            const result = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG);
            Pages.instance.add(result)
        }
    }
}

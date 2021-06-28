import React from 'react';

import {BarcodeResult} from 'scanbot-web-sdk/@types';

import ImageResultsPage from './pages/image-results-page';
import ImageDetailPage from './pages/image-detail-page';
import CroppingPage from './pages/cropping-page';

import Pages from './model/pages';
import {ScanbotSdkService} from './service/scanbot-sdk-service';
import {RoutePath, RoutingService} from './service/routing-service';

import DocumentScannerComponent from './rtu-ui/document-scanner-component';
import {AnimationType} from './rtu-ui/enum/animation-type';
import BarcodeScannerComponent from './rtu-ui/barcode-scanner-component';
import Barcodes from './model/barcodes';
import Onboarding from './pages/onboarding/onboarding-carousel';
import {StorageService} from "./service/storage-service";

import MainMenu from './pages/main-menu/main-menu';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';
import TextPage from "./pages/text-page";
import FileLoader from "./utils/file-loader";

const librariesTxt = require('./assets/Libraries.txt');

class App extends React.Component<any, any> {

    acknowledgements?: string;

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
        RoutingService.initialize(this.props.history);

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

        this.acknowledgements = await FileLoader.load(librariesTxt);

    }

    languageOrDefault(): string {
		const split = window.location.href.split('?lang=');
		if (split.length > 1) {
			return split[1];
		}
		return 'en';
	}

    onOnboardingSkip() {
        StorageService.instance.setHasVisited();
        this.setState({showOnboarding: false});
    }

    render() {

        const mainMenuProps = {
            language: this.state.language,
            pageCount: this.state.pageCount,
            callDocument: () => this._documentScanner?.push(AnimationType.PushRight),
            callBarcode: () => this._barcodeScanner?.push(AnimationType.PushBottom),
            viewDocuments: () => RoutingService.instance.goTo(RoutePath.ViewDocuments),
            viewAcknowledgements: () => {
                RoutingService.instance.goTo(RoutePath.Acknowledgements)
            }
        };

        return (
            <>
                {this.documentScanner()}
                {this.barcodeScanner()}
                <Switch>
                    <Route path='/welcome'>
                        <Onboarding skip={this.onOnboardingSkip.bind(this)} language={this.state.language}/>
                    </Route>
                    <Route exact path="/">
                        {this.state.showOnboarding ? <Redirect to='/welcome'/> : <MainMenu {...mainMenuProps}/>}
                    </Route>
                    <Route exact path={RoutePath.ViewDocuments}>
                        <ImageResultsPage sdk={this.state.sdk} />
                    </Route>
                    <Route exact path="/view-documents/:id">
                        <ImageDetailPage image={this.state.activeImage}/>
                    </Route>
                    <Route path="/view-documents/:id/cropping-view">
                        <CroppingPage sdk={this.state.sdk}/>
                    </Route>
                    <Route path={RoutePath.Acknowledgements}>
                        <TextPage text={this.acknowledgements}/>
                    </Route>
                </Switch>
            </>
        );
    }

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


    async onDocumentDetected(result: any) {
        ScanbotSdkService.instance.sdk?.utils.flash();
        Pages.instance.add(result);
        this.setState({
            pageCount: Pages.instance.count()
        })
    }

    async onBarcodesDetected(result: BarcodeResult) {
        Barcodes.instance.addAll(result.barcodes);
        // If you have any additional processing to do, consider pausing
        // the scanner here, else you might (will) receive multiple results:
        // ScanbotSdkService.instance.barcodeScanner?.pauseDetection();
        this.setState({alert: {color: "success", text: Barcodes.format(result.barcodes), autoClose: true}});
    }

    async onError(message: string) {
        this.setState({alert: {color: "error", text: message, autoClose: true}});
    }
}

export default withRouter(App);

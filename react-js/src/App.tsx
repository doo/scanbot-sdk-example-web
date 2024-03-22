import React from "react";
import { AppBar } from "@material-ui/core";
import Swal from "sweetalert2";

import { Barcode, BarcodeResult, TextDataScannerResult } from "scanbot-web-sdk/@types";

import { NavigationContent } from "./subviews/navigation-content";
import { Toast } from "./subviews/toast";
import FeatureList from "./subviews/feature-list";
import { BottomBar } from "./subviews/bottom-bar";

import ImageResultsPage from "./pages/image-results-page";
import ImageDetailPage from "./pages/image-detail-page";
import CroppingPage from "./pages/cropping-page";

import Pages from "./model/pages";
import { ScanbotSdkService } from "./service/scanbot-sdk-service";
import { RoutePath, RoutingService } from "./service/routing-service";

import { ImageUtils } from "./utils/image-utils";
import { NavigationUtils } from "./utils/navigation-utils";
import { MiscUtils } from "./utils/misc-utils";
import DocumentScannerComponent from "./rtu-ui/document-scanner-component";
import { AnimationType } from "./rtu-ui/enum/animation-type";
import BarcodeScannerComponent from "./rtu-ui/barcode-scanner-component";
import Barcodes from "./model/barcodes";
import ErrorLabel from "./subviews/error-label";
import MrzScannerComponent from "./rtu-ui/mrz-scanner-component";
import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import TextDataScannerComponent from "./rtu-ui/text-data-scanner-component";
import ResultParser from "./service/result-parser";
import { IBarcodePolygonHandle, IBarcodePolygonLabelHandle } from "scanbot-web-sdk/@types/model/configuration/selection-overlay-configuration";
import VINScannerComponent from "./rtu-ui/vin-scanner-component";

export default class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      alert: undefined,
      activeImage: undefined,
      sdk: undefined,
      error: {
        message: undefined,
      },
    };
  }

  async componentDidMount() {
    const sdk = await ScanbotSdkService.instance.initialize();
    this.setState({ sdk: sdk });

    RoutingService.instance.observeChanges(() => {
      this.forceUpdate();
    });

    await ScanbotSdkService.instance.setLicenseFailureHandler((error: any) => {

      RoutingService.instance.reset();

      this.setState({ error: { message: error } });
      if (this._documentScanner?.isVisible()) {
        this._documentScanner?.pop();
      }
      if (this._barcodeScanner?.isVisible()) {
        this._barcodeScanner?.pop();
      }
      if (this._barcodeScannerWithOverlay?.isVisible()) {
        this._barcodeScannerWithOverlay?.pop();
      }
      if (this._mrzScanner?.isVisible()) {
        this._mrzScanner?.pop();
      }
      if (this._textDataScanner?.isVisible()) {
        this._textDataScanner?.pop();
      }
      if (this._scanAndCounter?.isVisible()) {
        this._scanAndCounter?.pop();
      }
    });

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
    return window.innerHeight - 2 * this.toolbarHeight() ?? 0;
  }

  render() {
    return (
      <div>
        {this.documentScanner()}
        {this.barcodeScanner()}
        {this.barcodeScannerWithOverlay()}
        {this.mrzScanner()}
        {this.textDataScanner()}
        {this.vinScanner()}
        {this.scanAndCounter()}

        <Toast alert={this.state.alert} onClose={() => this.setState({ alert: undefined })} />

        <AppBar position="fixed" ref={(ref) => (this.navigation = ref)} style={{ zIndex: 19 }}>
          <NavigationContent backVisible={!NavigationUtils.isAtRoot()} onBackClick={() => this.onBackPress()} />
        </AppBar>
        <div style={{ height: this.containerHeight(), marginTop: this.toolbarHeight() }}>
          {this.decideContent()}
        </div>
        <BottomBar
          hidden={NavigationUtils.isAtRoot()}
          height={this.toolbarHeight()}
          buttons={this.decideButtons()}
        />
      </div>
    );
  }

  _documentScannerHtmlComponent: any;
  _documentScanner?: DocumentScannerComponent | null;
  documentScanner() {
    if (!this._documentScannerHtmlComponent) {
      this._documentScannerHtmlComponent = (
        <DocumentScannerComponent
          ref={(ref) => (this._documentScanner = ref)}
          sdk={this.state.sdk}
          onDocumentDetected={this.onDocumentDetected.bind(this)}
        />
      );
    }
    return this._documentScannerHtmlComponent;
  }

  _barcodeScannerHtmlComponent: any;
  _barcodeScanner?: BarcodeScannerComponent | null;
  barcodeScanner() {
    if (!this._barcodeScannerHtmlComponent) {
      this._barcodeScannerHtmlComponent = (
        <BarcodeScannerComponent
          ref={(ref) => (this._barcodeScanner = ref)}
          sdk={this.state.sdk}
          onBarcodesDetected={this.onBarcodesDetected.bind(this)}
        />
      );
    }
    return this._barcodeScannerHtmlComponent;
  }

  _barcodeScannerWithOverlayHtmlComponent: any;
  _barcodeScannerWithOverlay?: BarcodeScannerComponent | null;
  barcodeScannerWithOverlay() {
    if (!this._barcodeScannerWithOverlayHtmlComponent) {
      this._barcodeScannerWithOverlayHtmlComponent = (
        <BarcodeScannerComponent
          ref={(ref) => (this._barcodeScannerWithOverlay = ref)}
          sdk={this.state.sdk}
          additionalConfig={{
            overlay: {
              visible: true,
              onBarcodeFound: (code: Barcode, polygon: IBarcodePolygonHandle, label: IBarcodePolygonLabelHandle) => {
                // You can override onBarcodeFound and create your own implementation for custom styling, e.g.
                // if you wish to only color in certain types of barcodes, you can find and pick them, as demonstrated below:
                if (code.format === "QR_CODE") {
                  polygon.style({ fill: "rgba(255, 255, 0, 0.3)", stroke: "yellow" })
                }
              }
            },
            // When dealing with AR overlay, let's hide the finder and have the whole area be detectable
            showFinder: false
          }}
          onBarcodesDetected={this.onBarcodesDetected.bind(this)}
        />
      );
    }
    return this._barcodeScannerWithOverlayHtmlComponent;
  }

  _mrzScannerHtmlComponent: any;
  _mrzScanner?: MrzScannerComponent | null;
  mrzScanner() {
    if (!this._mrzScannerHtmlComponent) {
      this._mrzScannerHtmlComponent = (
        <MrzScannerComponent
          ref={(ref) => (this._mrzScanner = ref)}
          sdk={this.state.sdk}
          onMrzsDetected={this.onMrzDetected.bind(this)}
        />
      );
    }
    return this._mrzScannerHtmlComponent;
  }

  _textDataScannerHtmlComponent: any;
  _textDataScanner?: TextDataScannerComponent | null;
  textDataScanner() {
    if (!this._textDataScannerHtmlComponent) {
      this._textDataScannerHtmlComponent = (
        <TextDataScannerComponent
          ref={(ref) => (this._textDataScanner = ref)}
          sdk={this.state.sdk}
          onTextDataDetected={this.onTextDataDetected.bind(this)}
        />
      );
    }
    return this._textDataScannerHtmlComponent;
  }

  _vinScannerHtmlComponent: any;
  _vinScanner?: VINScannerComponent | null;
  vinScanner() {
    if (!this._vinScannerHtmlComponent) {
      this._vinScannerHtmlComponent = (
        <VINScannerComponent
          ref={(ref) => (this._vinScanner = ref)}
          sdk={this.state.sdk}
          onVINDetected={this.onVINDetected.bind(this)}
        />
      );
    }
    return this._vinScannerHtmlComponent;
  }

  _scanAndCounterHtmlComponent: any;
  _scanAndCounter?: BarcodeScannerComponent | null;
  scanAndCounter() {
    if (!this._scanAndCounterHtmlComponent) {
      this._scanAndCounterHtmlComponent = (
        <BarcodeScannerComponent
          ref={(ref) => (this._scanAndCounter = ref)}
          sdk={this.state.sdk}
          // To enable scan-and-count feature, add the additional config of scanAndCount: {}
          additionalConfig={{ scanAndCount: { enabled: true }, showFinder: false }}
          hideCameraSwapButtons={true}
          showBottomActionBar={false}
          onBarcodesDetected={(barcodes: Barcode[]) => {
            // Handle results as you please
          }}
        />
      );
    }
    return this._scanAndCounterHtmlComponent;
  }

  decideContent() {
    const route = NavigationUtils.findRoute();

    if (
      NavigationUtils.isAtRoot() ||
      route === RoutePath.DocumentScanner ||
      route === RoutePath.BarcodeScanner
    ) {
      return (
        <div>
          <ErrorLabel message={this.state.error.message} />
          <FeatureList onItemClick={this.onFeatureClick.bind(this)} />
        </div>
      );
    }

    if (route === RoutePath.CroppingView) {
      if (!Pages.instance.hasActiveItem()) {
        RoutingService.instance.reset();
        return null;
      }
      return <CroppingPage sdk={this.state.sdk} />;
    }

    if (route === RoutePath.ImageDetails) {
      if (!Pages.instance.hasActiveItem()) {
        RoutingService.instance.reset();
        return null;
      }
      return <ImageDetailPage image={this.state.activeImage} />;
    }
    if (route === RoutePath.ImageResults) {
      return (
        <ImageResultsPage
          sdk={this.state.sdk}
          onDetailButtonClick={async (index: number) => {
            Pages.instance.setActiveItem(index);
            this.setState({
              activeImage:
                await ScanbotSdkService.instance.documentImageAsBase64(index),
            });
            RoutingService.instance.route(RoutePath.ImageDetails, {
              index: index,
            });
          }}
        />
      );
    }
  }

  private decideButtons() {
    const route = NavigationUtils.findRoute();
    if (route === RoutePath.DocumentScanner) {
      return [
        { text: Pages.instance.count() + " PAGES", action: undefined },
        { text: "DONE", action: this.onBackPress.bind(this), right: true },
      ];
    }
    if (route === RoutePath.ImageResults) {
      return [
        { text: "SAVE PDF", action: this.savePDF.bind(this) },
        { text: "SAVE TIFF", action: this.saveTIFF.bind(this) },
      ];
    }
    if (route === RoutePath.ImageDetails) {
      return [
        { text: "CROP", action: this.openCroppingUI.bind(this) },
        { text: "FILTER", action: this.applyFilter.bind(this) },
        { text: "DELETE", action: this.deletePage.bind(this), right: true },
      ];
    }

    if (route === RoutePath.CroppingView) {
      return [
        { text: "DETECT", action: this.detect.bind(this) },
        { text: "ROTATE", action: this.rotate.bind(this) },
        { text: "APPLY", action: this.applyCrop.bind(this), right: true },
      ];
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
    this.setState({
      activeImage: await ScanbotSdkService.instance.documentImageAsBase64(
        index
      ),
    });
  }

  async savePDF() {
    const bytes = await ScanbotSdkService.instance.generatePDF(
      Pages.instance.get()
    );
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".pdf");
  }
  async saveTIFF() {
    const bytes = await ScanbotSdkService.instance.generateTIFF(
      Pages.instance.get()
    );
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".tiff");
  }

  openCroppingUI() {
    RoutingService.instance.route(RoutePath.CroppingView, {
      index: Pages.instance.getActiveIndex(),
    });
  }

  async applyFilter() {
    const page = Pages.instance.getActiveItem();
    const result = await Swal.fire({
      title: "Select filter",
      input: "select",
      inputOptions: ScanbotSdkService.instance.availableFilters(),
      inputPlaceholder: page.filter ?? "none",
    });

    const filter = ScanbotSdkService.instance.filterNameByIndex(result.value);

    // "None" is not an actual filter, only used in this example app
    if (filter === "none") {
      page.filter = undefined;
      page.filtered = undefined;
    } else {
      page.filter = filter;
      page.filtered = await ScanbotSdkService.instance.applyFilter(
        page.cropped ?? page.original,
        filter
      );
    }

    const index = Pages.instance.getActiveIndex();
    this.setState({
      activeImage: await ScanbotSdkService.instance.documentImageAsBase64(
        index
      ),
    });
  }

  deletePage() {
    Pages.instance.removeActiveItem();
    RoutingService.instance.route(RoutePath.ImageResults);
  }

  async onDocumentDetected(result: any) {
    Pages.instance.add(result);
    ScanbotSdkService.instance.sdk?.utils.flash();

    console.log("Document detection result:", result);
  }

  async onBarcodesDetected(result: BarcodeResult) {
    Barcodes.instance.addAll(result.barcodes);
    // If you have any additional processing to do, consider pausing
    // the scanner here, else you might (will) receive multiple results:
    // ScanbotSdkService.instance.barcodeScanner?.pauseDetection();
    this.setState({
      alert: { color: "success", text: this.formatBarcodes(result.barcodes) },
    });
  }

  async onMrzDetected(mrz: MrzResult) {
    ScanbotSdkService.instance.mrzScanner?.pauseDetection();
    const text = ResultParser.MRZToString(mrz);
    await MiscUtils.alert(text);

    setTimeout(() => {
      ScanbotSdkService.instance.mrzScanner?.resumeDetection();
    }, 1000);
  }

  async onTextDataDetected(textData: TextDataScannerResult) {
    if (!textData) return;

    if (textData.validated) {
      ScanbotSdkService.instance.textDataScanner?.pauseDetection();
      await MiscUtils.alert(textData.text!);
      setTimeout(() => { ScanbotSdkService.instance.textDataScanner?.resumeDetection() }, 500);
    }
  }

  async onVINDetected(textData: TextDataScannerResult) {
    if (!textData) return;
    
    // The VIN scanner does not return empty results, so we can skip 'validated' check here
    // However, validated will still be true if several frames detected the same number
    ScanbotSdkService.instance.vinScanner?.pauseDetection();
    await MiscUtils.alert(textData.text!);
    setTimeout(() => { ScanbotSdkService.instance.vinScanner?.resumeDetection() }, 500);
    this.createOcrEngine({ mode: "VIN" });
    this.createOcrEngine();
  }

  async createOcrEngine(options?: { mode: string }) {

  }

  formatBarcodes(codes: Barcode[]): string {
    return JSON.stringify(
      codes.map((code: Barcode) => {
        return code.parsedText || `${code.text} (${code.format})`;
      })
    );
  }

  async onFeatureClick(feature: any) {
    const valid = await ScanbotSdkService.instance.isLicenseValid();
    if (!valid) {
      console.error(
        "License invalid or expired. ScanbotSDK features not available"
      );
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
    if (feature.id === RoutePath.BarcodeScannerWithOverlay) {
      this._barcodeScannerWithOverlay?.push(AnimationType.PushBottom);
      return;
    }
    if (feature.id === RoutePath.MrzScanner) {
      this._mrzScanner?.push(AnimationType.PushRight);
      return;
    }
    if (feature.id === RoutePath.TextDataScanner) {
      this._textDataScanner?.push(AnimationType.PushRight);
      return;
    }
    if (feature.id === RoutePath.TextDataScanner) {
      this._textDataScanner?.push(AnimationType.PushRight);
      return;
    }
    if (feature.id === RoutePath.VINScanner) {
      this._vinScanner?.push(AnimationType.PushRight);
      return;
    }
    if (feature.id === RoutePath.ScanAndCount) {
      this._scanAndCounter?.push(AnimationType.PushRight);
      return;
    }

    if (feature.route) {
      RoutingService.instance.route(feature.route);
      return;
    }

    if (feature.id === RoutePath.LicenseInfo) {
      const info = await this.state.sdk?.getLicenseInfo();
      const color = info?.status === "Trial" ? "success" : "error";
      this.setState({ alert: { color: color, text: JSON.stringify(info) } });
    } else if (feature.id === RoutePath.DocumentOnJpeg) {
      const image = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG, document.getElementById(feature.id) as any);

      const contourDetectionResult = await ScanbotSdkService.instance.detectDocument(image.original);
      if (contourDetectionResult.success === true && contourDetectionResult.polygon) {
        const cropped = await ScanbotSdkService.instance.cropAndRotateImageCcw(image.original, contourDetectionResult.polygon, 0);
        const documentDetectionResult = { ...contourDetectionResult, original: image.original, cropped: cropped };

        Pages.instance.add(documentDetectionResult);
        await MiscUtils.alert("Detection successful");
      } else {
        await MiscUtils.alert("Detection failed");
      }
    } else if (feature.id === RoutePath.BarcodeOnJpeg) {
      const result = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG, document.getElementById(feature.id) as any, true);
      const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
        result.data
      );
      if (detection !== undefined) {
        this.setState({
          alert: {
            color: "success",
            text: this.formatBarcodes(detection.barcodes),
          },
        });
      }
    } else if (feature.id === RoutePath.BarcodeOnPdf) {
      const pdf = await ImageUtils.pick(ImageUtils.MIME_TYPE_PDF, document.getElementById(feature.id) as any, true);
      console.log('Converting the pdf to images');
      const images = await ImageUtils.pdfToImage(pdf.data);

      for (let i = 0; i < images.length; i++) {
        console.log(`Detect barcodes on page ${i}`);
        const detection = await ScanbotSdkService.instance.sdk?.detectBarcodes(
          images[i]
        );
        if (detection !== undefined && detection.barcodes.length > 0) {
          this.setState({
            alert: {
              color: "success",
              text: this.formatBarcodes(detection.barcodes),
            },
          });
        }
      }
    }
  }
}

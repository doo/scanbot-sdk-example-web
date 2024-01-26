// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {
  DocumentScannerConfiguration,
  IDocumentScannerHandle,
  CroppingViewConfiguration,
  ICroppingViewHandle,
  BarcodeScannerConfiguration,
  IBarcodeScannerHandle,
  BinarizationFilter,
  ColorFilter,
  ImageFilter,
  TiffGenerationOptions,
  PdfGenerationOptions,
  TiffGenerator,
  PdfGenerator,
  Polygon,
  TextDataScannerConfiguration,
  ITextDataScannerHandle,
  MrzScannerConfiguration,
  TextDataScannerResult,
  DocumentDetectionResult,
} from "scanbot-web-sdk/@types";

import Pages from "../model/pages";
import { ImageUtils } from "../utils/image-utils";
import { BarcodeFormat } from "scanbot-web-sdk/@types/model/barcode/barcode-format";
import { IMrzScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-mrz-scanner-handle";
import { ContourDetectionResult } from "scanbot-web-sdk/@types/model/document/contour-detection-result";
import { VINScannerConfiguration } from "scanbot-web-sdk/@types/model/configuration/vin-scanner-configuration";

export class ScanbotSdkService {

  static DOCUMENT_SCANNER_CONTAINER = "document-scanner-view";
  static CROPPING_VIEW_CONTAINER = "cropping-view";
  static BARCODE_SCANNER_CONTAINER = "barcode-scanner-view";
  static MRZ_SCANNER_CONTAINER = "mrz-scanner-view";
  static TEXTDATA_SCANNER_CONTAINER = "text-data-scanner-view";
  static VIN_SCANNER_CONTAINER = "vin-scanner-view";

  public static instance = new ScanbotSdkService();

  license = "";

  sdk?: ScanbotSDK;

  documentScanner?: IDocumentScannerHandle;
  barcodeScanner?: IBarcodeScannerHandle;
  mrzScanner?: IMrzScannerHandle;
  textDataScanner?: ITextDataScannerHandle;
  vinScanner?: ITextDataScannerHandle;
  croppingView?: ICroppingViewHandle;

  public async initialize() {
    this.sdk = await ScanbotSDK.initialize({
      licenseKey: this.license,
      engine: "/",
      allowThreads: true
    });
    return this.sdk;
  }

  async setLicenseFailureHandler(callback: any) {
    await this.setLicenceTimeout(callback);
  }

  private async setLicenceTimeout(callback: any) {
    // Scanbot WebSDK does not offer real-time license failure handler. Simply loop to check it manually
    const info = await this.sdk?.getLicenseInfo();
    if (info && info.status !== "Trial" && info.status !== "Okay") {
      callback(info.description);
    } else {
      setTimeout(() => {
        this.setLicenceTimeout(callback);
      }, 2000);
    }
  }
  public async isLicenseValid(): Promise<boolean> {
    const info = await this.sdk?.getLicenseInfo();
    if (!info) {
      return false;
    }
    return info.isValid();
  }

  public async createDocumentQualityAnalyzer() {
    return this.sdk?.createDocumentQualityAnalyzer();
  }

  public async analyzeDocumentQuality(result: DocumentDetectionResult) {
    /** 
     * Initialization of the analyzer can cause a strain on your user interface,
     * In a real-life scenario, consider creating the analyzer once on app/scanner startup, not for every scan.
     */
    const analyzer = await ScanbotSdkService.instance.createDocumentQualityAnalyzer();
    console.log('Document quality analysis:', await analyzer?.analyze(result.original));
    await analyzer?.release();
  }

  public async createDocumentScanner(detectionCallback: any, errorCallback: (e: Error) => void) {
    const config: DocumentScannerConfiguration = {
      onDocumentDetected: detectionCallback,
      containerId: ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER,
      text: {
        hint: {
          OK: "Capturing your document...",
          OK_SmallSize: "The document is too small. Try moving closer.",
          OK_BadAngles:
            "This is a bad camera angle. Hold the device straight over the document.",
          OK_BadAspectRatio:
            "Rotate the device sideways, so that the document fits better into the screen.",
          OK_OffCenter: "Try holding the device at the center of the document.",
          Error_NothingDetected:
            "Please hold the device over a document to start scanning.",
          Error_Brightness: "It is too dark. Try turning on a light.",
          Error_Noise: "Please move the document to a clear surface.",
        },
      },
      style: {
        // Note that alternatively, styling the document scanner is also possible using CSS classes.
        // For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
        outline: {
          polygon: {
            fillCapturing: "rgba(0, 255, 0, 0.2)",
            strokeCapturing: "green",
            fillSearching: "rgba(255, 0, 0, 0.2)",
            strokeSearching: "red",
          }
        }
      },
      onError: errorCallback,
      preferredCamera: 'camera2 0, facing back'
    };
    this.documentScanner = await this.sdk!.createDocumentScanner(config);
  }

  public disposeDocumentScanner() {
    this.documentScanner?.dispose();
  }

  public async createBarcodeScanner(callback: any, errorCallback: (e: Error) => void, additionalConfig: any = {}) {
    const barcodeFormats: BarcodeFormat[] = [
      "AZTEC",
      "CODABAR",
      "CODE_39",
      "CODE_93",
      "CODE_128",
      "DATA_MATRIX",
      "EAN_8",
      "EAN_13",
      "ITF",
      "MAXICODE",
      "PDF_417",
      "QR_CODE",
      "RSS_14",
      "RSS_EXPANDED",
      "UPC_A",
      "UPC_E",
      "UPC_EAN_EXTENSION",
      "MSI_PLESSEY",
    ];

    const config: BarcodeScannerConfiguration = {
      containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER,
      captureDelay: 1000,
      onBarcodesDetected: callback,
      barcodeFormats: barcodeFormats,
      onError: errorCallback,
      preferredCamera: 'camera2 0, facing back',
      ...additionalConfig
    };

    this.barcodeScanner = await this.sdk!.createBarcodeScanner(config);
  }

  public disposeBarcodeScanner() {
    this.barcodeScanner?.dispose();
  }

  public async createMrzScanner(onMrzDetected: any, errorCallback: (e: Error) => void) {
    const config: MrzScannerConfiguration = {
      containerId: ScanbotSdkService.MRZ_SCANNER_CONTAINER,
      onMrzDetected: onMrzDetected,
      onError: errorCallback,
      preferredCamera: 'camera2 0, facing back'
    };

    this.mrzScanner = await this.sdk!.createMrzScanner(config);
  }

  public disposeMrzScanner() {
    this.mrzScanner?.dispose();
  }

  public disposeTextDataScanner() {
    this.textDataScanner?.dispose();
  }

  public disposeVINScanner() {
    this.vinScanner?.dispose();
  }

  public async createTextDataScanner(onTextDetected: any, errorCallback: (e: Error) => void) {
    const config: TextDataScannerConfiguration = {
      containerId: ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER,
      onTextDetected: onTextDetected,
      supportedLanguages: ['eng', 'deu'],
      onError: errorCallback,
      preferredCamera: 'camera2 0, facing back'
    };

    this.textDataScanner = await this.sdk!.createTextDataScanner(config);
  }

  public async createVINScanner(onVINDetected: any, errorCallback: (e: Error) => void) {

    const config: VINScannerConfiguration = {
      containerId: ScanbotSdkService.VIN_SCANNER_CONTAINER,
      onTextDetected: (e: TextDataScannerResult) => {
        console.log("VIN detected: ", e);
        onVINDetected(e);
      },
      onError: errorCallback,
    }

    this.vinScanner = await this.sdk!.createVINScanner(config);
  }

  public async openCroppingView(page: any) {
    const configuration: CroppingViewConfiguration = {
      containerId: ScanbotSdkService.CROPPING_VIEW_CONTAINER,
      image: page.original,
      polygon: page.polygon,
      rotations: page.rotations ?? 0,
    };

    this.croppingView = await this.sdk!.openCroppingView(configuration);
  }

  public disposeCroppingView() {
    this.croppingView?.dispose();
  }

  public binarizationFilters(): BinarizationFilter[] {
    return [
      "binarized",
      "otsuBinarization",
      "pureBinarized",
      "lowLightBinarization",
      "lowLightBinarization2",
      "deepBinarization",
    ];
  }

  public colorFilters(): ColorFilter[] {
    return ["color", "gray", "colorDocument", "blackAndWhite", "edgeHighlight"];
  }

  public availableFilters(): string[] {
    return ["none"]
      .concat(this.binarizationFilters())
      .concat(this.colorFilters());
  }
  filterByIndex(value: string) {
    return this.availableFilters()[parseInt(value)];
  }

  public async applyFilter(image: ArrayBuffer, filter: ImageFilter) {
    return await this.sdk!.applyFilter(image, filter);
  }

  async documentImageAsBase64(index: number) {
    const bytes = Pages.instance.imageAtIndex(index);
    if (bytes) {
      return await this.sdk!.toDataUrl(bytes);
    }
  }

  async reapplyFilter() {
    const existing = Pages.instance.getActiveItem();
    if (!existing.filter) {
      return;
    }
    existing.filtered = await this.applyFilter(
      existing.cropped,
      existing.filter
    );
  }

  async generatePDF(pages: any[]) {
    const options: PdfGenerationOptions = {
      standardPaperSize: "A4",
      pageDirection: "PORTRAIT"
    };
    const generator: PdfGenerator = await this.sdk!.beginPdf(options);
    for (const page of pages) {
      let image = page.filtered ?? page.cropped ?? page.original;
      image = await ImageUtils.downscale(this.sdk!, image);
      await generator.addPage(image);
    }
    return await generator.complete();
  }

  async generateTIFF(pages: any[]) {
    const options: TiffGenerationOptions = {
      binarizationFilter: "deepBinarization",
      dpi: 72,
    };
    const generator: TiffGenerator = await this.sdk!.beginTiff(options);
    for (const page of pages) {
      await generator.addPage(page.cropped ?? page.original);
    }
    return await generator.complete();
  }

  async detectDocument(image: ArrayBuffer): Promise<ContourDetectionResult> {
    return await this.sdk!.detectDocument(image);
  }

  async cropAndRotateImageCcw(image: ArrayBuffer, polygon: Polygon, rotations: number): Promise<Uint8Array> {
    return await this.sdk!.cropAndRotateImageCcw(image, polygon, rotations);
  }
}

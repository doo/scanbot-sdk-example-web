import { Injectable } from "@angular/core";

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {
  IDocumentScannerHandle,
  ICroppingViewHandle,
  CroppingViewConfiguration,
  PdfGenerator,
  TiffGenerator,
  IBarcodeScannerHandle,
  Polygon,
  ITextPatternScannerHandle,
  Image,
  BarcodeScannerViewConfiguration,
  DocumentScannerViewConfiguration,
  MrzScannerViewConfiguration,
  DocumentDataExtractorViewConfiguration,
  PdfConfiguration,
  TiffGeneratorParameters,
  ParametricFilter,
} from "scanbot-web-sdk/@types";

import { IMrzScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-mrz-scanner-handle";
import { IScannerCommon } from "scanbot-web-sdk/@types/interfaces/i-scanner-common-handle";
import { Utils } from "./utils";

@Injectable()
export class ScanbotSdkService {

  static CONTAINER_ID = "scanbot-camera-container";
  static BARCODE_SCANNER_CONTAINER_ID = "barcode-scanner-container";
  static MRZ_SCANNER_CONTAINER_ID = "mrz-scanner-container";
  static TEXTDATA_SCANNER_CONTAINER_ID = "textdata-scanner-container";

  private instance: ScanbotSDK;

  onReady: any;

  private documentScanner: IDocumentScannerHandle;
  private barcodeScanner: IBarcodeScannerHandle;
  private mrzScanner: IMrzScannerHandle;
  private textDataScanner: ITextPatternScannerHandle;
  private cropper: ICroppingViewHandle;

  isReady(): boolean {
    return this.instance !== undefined;
  }

  constructor() {
    const options = { licenseKey: "", enginePath: "assets/wasm" };
    ScanbotSDK.initialize(options).then((result) => {
      this.instance = result;
      if (this.onReady) {
        this.onReady();
      }
    });
  }

  async scanDocuments(configuration: DocumentScannerViewConfiguration) {
    this.documentScanner = await this.instance.createDocumentScanner(
      configuration
    );
  }

  async scanBarcodes(configuration: BarcodeScannerViewConfiguration, finderVisible: boolean = true) {
    this.barcodeScanner = await this.instance.createBarcodeScanner(
      configuration
    );

    this.barcodeScanner.setFinderVisible(finderVisible);
  }

  async scanMrz(configuration: MrzScannerViewConfiguration) {
    this.mrzScanner = await this.instance.createMrzScanner(configuration);
  }

  async scanTextData(configuration: DocumentDataExtractorViewConfiguration) {
    this.textDataScanner = await this.instance.createTextPatternScanner(configuration);
  }

  async setTextDataScannerDetectionStatus(pause: boolean) {
    if (pause) {
      this.textDataScanner.pauseDetection();
    } else {
      this.textDataScanner.resumeDetection();
    }
  }

  delayAutoCapture() {
    this.documentScanner.disableAutoCapture();
    setTimeout(() => {
      this.documentScanner.enableAutoCapture();
    }, 3000);
  }

  disposeDocumentScanner() {
    this.documentScanner.dispose();
  }

  disposeBarcodeScanner() {
    this.barcodeScanner.dispose();
  }

  disposeMrzScanner() {
    this.mrzScanner.dispose();
  }

  disposeTextDataScanner() {
    this.textDataScanner.dispose();
  }

  disposeCroppingView() {
    this.cropper.dispose();
  }

  async crop(configuration: CroppingViewConfiguration) {
    this.cropper = await this.instance.openCroppingView(configuration);
  }

  async detectInCropper() {
    await this.cropper.detect();
  }

  async rotateInCropper() {
    await this.cropper.rotate(1);
  }

  async applyCrop() {
    return await this.cropper.apply();
  }

  async toDataUrl(page: any) {
    return await this.instance.toDataUrl(
      await this.instance.imageToJpeg(
        page.filtered ?? page.cropped ?? page.original
      )
    );
  }

  async licenseInfoString() {
    return JSON.stringify(await this.instance.getLicenseInfo());
  }

  async generatePDF(pages: any[]) {
    const options: Partial<PdfConfiguration> = {
      pageSize: "A4",
      pageDirection: "PORTRAIT"
    };
    const generator: PdfGenerator = await this.instance.beginPdf(options);
    for (const page of pages) {
      await generator.addPage(page.filtered ?? page.cropped ?? page.original);
    }
    return await generator.complete();
  }

  async generateTIFF(pages: any[]) {
    const options: Partial<TiffGeneratorParameters> = {
      dpi: 123,
    };
    const generator: TiffGenerator = await this.instance.beginTiff(options);
    for (const page of pages) {
      const image = page.cropped ?? page.original;
      await generator.addPage(await this.applyFilter(image, new ScanbotSDK.Config.ScanbotBinarizationFilter()));
    }
    return await generator.complete();
  }

  public async applyFilter(image: ArrayBuffer, filter: ParametricFilter) {
    return await this.instance.imageFilter(image, filter)
  }

  public availableFilters(): ("none" | ParametricFilter)[] {
    return [
      "none",
      new ScanbotSDK.Config.ScanbotBinarizationFilter(),
      new ScanbotSDK.Config.GrayscaleFilter(),
      new ScanbotSDK.Config.ContrastFilter(),
      new ScanbotSDK.Config.ColorDocumentFilter(),
    ];
  }

  filterByIndex(value: string): "none" | ParametricFilter {
    return this.availableFilters()[parseInt(value, 10)];
  }

  async detectBarcodes(image: Image) {
    return await this.instance.detectBarcodes(image);
  }

  async detectDocument(image: Image) {
    return await this.instance.detectDocument(image);
  }

  async cropAndRotateImageCcw(image: ArrayBuffer, polygon: Polygon, rotations: number): Promise<Image> {
    const cropped = await this.instance.imageCrop(image, polygon);
    return await this.instance.imageRotate(cropped, ScanbotSDK.Config.ImageRotationValues[rotations % 4], 'CONSUME_IMAGE');
  }

  public swapDocumentScannerCameraFacing() {
    this.documentScanner?.swapCameraFacing(true);
  }

  public swapBarcodeScannerCameraFacing() {
    this.barcodeScanner?.swapCameraFacing(true);
  }

  public swapMrzScannerCameraFacing() {
    this.mrzScanner?.swapCameraFacing(true);
  }

  public swapTextDataScannerCameraFacing() {
    this.textDataScanner?.swapCameraFacing(true);
  }

  public switchBarcodeScannerCameraFacing() {
    this.onCameraSwitch(this.barcodeScanner);
  }

  public switchDocumentScannerCameraFacing() {
    this.onCameraSwitch(this.documentScanner);
  }

  public switchMrzScannerCameraFacing() {
    this.onCameraSwitch(this.mrzScanner);
  }

  public switchTextDataScannerCameraFacing() {
    this.onCameraSwitch(this.textDataScanner);
  }

  private async onCameraSwitch(scanner: IScannerCommon) {
    const cameras = await scanner?.fetchAvailableCameras()
    if (cameras) {
      const currentCameraInfo = scanner?.getActiveCameraInfo();
      if (currentCameraInfo) {
        const cameraIndex = cameras.findIndex((cameraInfo) => { return cameraInfo.deviceId === currentCameraInfo.deviceId });
        const newCameraIndex = (cameraIndex + 1) % (cameras.length);
        await Utils.alertHtml(
          `Current camera: ${currentCameraInfo.label}.<br/>Switching to: ${cameras[newCameraIndex].label}`
        );
        scanner?.switchCamera(cameras[newCameraIndex].deviceId, false);
      }
    }
  }
}

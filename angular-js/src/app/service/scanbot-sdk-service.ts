import {Injectable} from "@angular/core";
// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";
// Other typings should be imported from @types
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {BinarizationFilter, ColorFilter, ImageFilter} from "scanbot-web-sdk/@types/model/filter-types";

@Injectable()
export class ScanbotSdkService {


  static CONTAINER_ID = "scanbot-camera-container";

  private instance: ScanbotSDK;

  onReady: any;

  private scanner: IDocumentScannerHandle;
  private cropper: ICroppingViewHandle;

  isReady(): boolean {
    return this.instance !== undefined;
  }

  constructor() {
    const options = {licenseKey: ""};
    ScanbotSDK.initialize(options).then(result => {
      this.instance = result;
      if (this.onReady) {
        this.onReady();
      }
    });
  }

  async scan(configuration: DocumentScannerConfiguration) {
    this.scanner = await this.instance.createDocumentScanner(configuration);
  }

  disposeScanner() {
    this.scanner.dispose();
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
    return await this.instance.toDataUrl(page.filtered ?? page.cropped ?? page.original);
  }

  async licenseInfoString() {
    return JSON.stringify(await this.instance.getLicenseInfo());
  }

  async generatePDF(pages: any[]) {
    const generator = await this.instance.beginPdf({standardPaperSize: "A4", landscape: true, dpi: 100});
    this.addAllPagesTo(generator, pages);
    return await generator.complete();
  }

  async generateTIFF(pages: any[]) {
    const generator = await this.instance.beginTiff({binarizationFilter: BinarizationFilter.DeepBinarization, dpi: 123});
    this.addAllPagesTo(generator, pages);
    return await generator.complete();
  }

  private async addAllPagesTo(generator: any, pages: any[]) {
    for (const page of pages) {
      await generator.addPage(page.cropped ?? page.original);
    }
  }

  public async applyFilter(image: ArrayBuffer, filter: ImageFilter) {
    return await this.instance.applyFilter(image, filter);
  }

  public availableFilters() {
    return [
      "none",
      BinarizationFilter.LowLightBinarization,
      BinarizationFilter.LowLightBinarization2,
      BinarizationFilter.DeepBinarization,
      BinarizationFilter.Binarized,
      BinarizationFilter.OtsuBinarization,
      BinarizationFilter.PureBinarized,
      ColorFilter.BlackAndWhite,
      ColorFilter.Color,
      ColorFilter.ColorDocument,
      ColorFilter.Gray,
      ColorFilter.EdgeHighlight,
      ColorFilter.LightMapNormalization,
      ColorFilter.Trinarization
    ];
  }

  filterByIndex(value: string) {
    return this.availableFilters()[parseInt(value)];
  }
}

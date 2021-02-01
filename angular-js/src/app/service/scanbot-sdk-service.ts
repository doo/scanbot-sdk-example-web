import {Injectable} from "@angular/core";

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";
import {ImageUtils} from "./image-utils";

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

  async toDataUrl(page: any) {
    return await this.instance.toDataUrl(page.cropped ?? page.original);
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
    const generator = await this.instance.beginTiff({binarizationFilter: "deepBinarization", dpi: 123});
    this.addAllPagesTo(generator, pages);
    return await generator.complete();
  }

  private async addAllPagesTo(generator: any, pages: any[]) {
    for (const page of pages) {
      await generator.addPage(page);
    }
  }
}

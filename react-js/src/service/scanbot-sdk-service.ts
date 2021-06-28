
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
    ImageFilter,
    TiffGenerationOptions,
    PdfGenerationOptions,
    TiffGenerator,
    PdfGenerator,
} from "scanbot-web-sdk/@types";

import Pages from "../model/pages";
import {ImageUtils} from "../utils/image-utils";
import DetailedImageFilter from "../model/DetailedImageFilter";


export class ScanbotSdkService {

    static DOCUMENT_SCANNER_CONTAINER = "document-scanner-view";
    static CROPPING_VIEW_CONTAINER = "cropping-view";
    static BARCODE_SCANNER_CONTAINER = "barcode-scanner-view";

    public static instance = new ScanbotSdkService();

    license = "";

    sdk?: ScanbotSDK;

    documentScanner?: IDocumentScannerHandle;
    barcodeScanner?: IBarcodeScannerHandle;
    croppingView?: ICroppingViewHandle;

    public async initialize() {
        this.sdk = await ScanbotSDK.initialize({licenseKey: this.license, engine: "/"});
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
            },2000);
        }

    }
    public async isLicenseValid(): Promise<boolean> {
        const info = await this.sdk?.getLicenseInfo();
        if (!info) {
            return false;
        }
        return info.status === "Trial" || info.status === "Okay";
    }

    public async createDocumentScanner(detectionCallback: any) {
        const config: DocumentScannerConfiguration = {
            onDocumentDetected: detectionCallback,
            containerId: ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER
        };

        if (this.sdk) {
            this.documentScanner = await this.sdk!.createDocumentScanner(config);
        }
    }

    public disposeDocumentScanner() {
        this.documentScanner?.dispose();
    }

    public async createBarcodeScanner(callback: any) {
        const config: BarcodeScannerConfiguration = {
            containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER,
            captureDelay: 1000,
            onBarcodesDetected: callback
        };
        if (this.sdk) {
            this.barcodeScanner = await this.sdk!.createBarcodeScanner(config);
        }
    }

    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }

    public async openCroppingView(page: any) {
        const configuration: CroppingViewConfiguration = {
            containerId: ScanbotSdkService.CROPPING_VIEW_CONTAINER,
            image: page.original,
            polygon: page.polygon,
            rotations: page.rotations ?? 0
        };

        this.croppingView = await this.sdk!.openCroppingView(configuration);
    }

    public disposeCroppingView() {
        this.croppingView?.dispose();
    }

    public availableFilters(): DetailedImageFilter[] {
        return [
            new DetailedImageFilter("none",
                "Passthrough filter. Does not alter the image."),
            new DetailedImageFilter("color",
                "Optimizes colors, contrast and brightness. Usecase: photos."),
            new DetailedImageFilter("gray",
                "Standard grayscale filter. Creates a grayscaled 8-bit image."),
            new DetailedImageFilter("colorDocument",
                "Fixes white-balance and cleans up the background. Usecase: images of paper documents."),
            new DetailedImageFilter("blackAndWhite",
                "Black and white filter with background cleaning. " +
                "Creates a grayscaled 8-bit image with mostly black or white pixels. " +
                "Usecase: Textual documents or documents with black and white illustrations."),
            new DetailedImageFilter("edgeHighlight",
                "A filter that enhances edges in low-contrast documents."),
            new DetailedImageFilter("binarized",
                "Standard binarization filter with contrast optimization. " +
                "Creates a grayscaled 8-bit image with mostly black or white pixels. " +
                "Usecase: Preparation for optical character recognition."),
            new DetailedImageFilter("otsuBinarization",
                "A filter for black and white conversion using OTSU binarization."),
            new DetailedImageFilter("pureBinarized",
                "A filter for binarizing an image. " +
                "Creates an 8-bit image with pixel values set to eiter 0 or 255. " +
                "Usecase: Preparation for optical character recognition."),
            new DetailedImageFilter("lowLightBinarization",
                "Binarization filter primary intended to use on low-contrast documents with heavy shadows."),
            new DetailedImageFilter("lowLightBinarization2",
                "Binarization filter primary intended to use on low-contrast documents with heavy shadows."),
            new DetailedImageFilter("deepBinarization",
                "A filter for black and white conversion primary used for low-contrast documents.")
        ];
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
        existing.filtered = await this.applyFilter(existing.cropped, existing.filter);
    }

    async generatePDF(pages: any[]) {
        // When scaling down an image, also lower the dots-per-inch parameter. Else it won't fill the page
        const options: PdfGenerationOptions = {standardPaperSize: "A4", landscape: true, dpi: 1};
        const generator: PdfGenerator = await this.sdk!.beginPdf(options);
        for (const page of pages) {
            let image = page.filtered ?? page.cropped ?? page.original;
            image = await ImageUtils.downscale(this.sdk!, image);
            await generator.addPage(image);
        }
        return await generator.complete();
    }

    async generateTIFF(pages: any[]) {
        const options: TiffGenerationOptions = {binarizationFilter: "deepBinarization", dpi: 123};
        const generator: TiffGenerator = await this.sdk!.beginTiff(options);
        for (const page of pages) {
            await generator.addPage(page.cropped ?? page.original);
        }
        return await generator.complete();
    }
}

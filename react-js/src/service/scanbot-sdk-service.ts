
// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {
    ICroppingViewHandle,
    IDocumentScannerHandle,
    DocumentScannerConfiguration,
    BinarizationFilter,
    ColorFilter,
    ImageFilter
} from "scanbot-web-sdk/@types";

import Pages from "../model/Pages";

export class ScanbotSdkService {

    static DOCUMENT_SCANNER_CONTAINER = "document-scanner-view";
    static CROPPING_VIEW_CONTAINER = "cropping-view";

    public static instance = new ScanbotSdkService();

    license = "";

    sdk?: ScanbotSDK;
    documentScanner?: IDocumentScannerHandle;
    croppingView?: ICroppingViewHandle;

    public async initialize() {
        this.sdk = await ScanbotSDK.initialize({licenseKey: this.license, engine: "/"});
        return this.sdk;
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

    public async openCroppingView(page: any) {
        const configuration = {containerId: ScanbotSdkService.CROPPING_VIEW_CONTAINER, image: page.original, polygon:page.polygon};

        this.croppingView = await this.sdk!.openCroppingView(configuration);
    }

    public disposeCroppingView() {
        this.croppingView?.dispose();
    }

    public binarizationFilters(): BinarizationFilter[] {
        return [
            'binarized',
            'otsuBinarization',
            'pureBinarized',
            'lowLightBinarization',
            'lowLightBinarization2',
            'deepBinarization'
        ];
    }

    public colorFilters(): ColorFilter[] {
        return [
            'color',
            'gray',
            'colorDocument',
            'blackAndWhite',
            'edgeHighlight',
            'trinarization',
            'lightMapNormalization'
        ];
    }

    public availableFilters(): string[] {
        return ["none"].concat(this.binarizationFilters()).concat(this.colorFilters());
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
        const generator = await this.sdk!.beginPdf({standardPaperSize: "A4", landscape: true, dpi: 100});
        for (const page of pages) {
            await generator.addPage(page.filtered ?? page.cropped ?? page.original);
        }
        return await generator.complete();
    }
}

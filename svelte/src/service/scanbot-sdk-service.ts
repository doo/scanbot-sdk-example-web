import type ScanbotSDK from 'scanbot-web-sdk';

import type {
    BarcodeScannerResultWithSize,
    BarcodeScannerViewConfiguration,
    DocumentScannerViewConfiguration,
    IBarcodeScannerHandle,
    ICroppingViewHandle,
    IDocumentScannerHandle,
    Polygon,
    CroppingViewConfiguration,
    DocumentScannerScanResponse,
    Image,
    SBStoreCroppedDetectionResult,
    SBStorage
} from 'scanbot-web-sdk/@types';

export class ScanbotDocument {
    id?: string;
    base64?: string;
    cropped?: Image;
    original!: Image;
    polygon?: Polygon;
    rotations?: number;
}

export default class ScanbotSDKService {

    public static instance: ScanbotSDKService = new ScanbotSDKService();

    private sdk?: ScanbotSDK;

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;
    private croppingView?: ICroppingViewHandle;

    private documents!: SBStoreCroppedDetectionResult[];

    public async initialize() {

        if (this.sdk) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }
        // Use dynamic inline imports to load the SDK, as SvelteKit may attempt to load it before the 'window' object becomes available.
        // Please be aware that this initialization function is invoked after a Svelte component has been mounted.
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({
            licenseKey: '',
            // WASM files are copied to this directory by the npm postinstall script
            enginePath: '/wasm',
        });

        ScanbotSDKService.instance.loadDocuments();
    }

    get storage(): SBStorage | undefined {
        return this.sdk?.storage;
    }

    public async loadDocuments() {
        if (!this.documents) {
            const results = await this.storage?.getCroppedDetectionResults(true) ?? [];
            this.documents = results;
        }
    }

    public async createDocumentScanner(containerId: string) {

        /*
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the document url scanner directly.
        */
        await this.initialize();

        const config: DocumentScannerViewConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e: DocumentScannerScanResponse) => {
                console.log("Detected document!");

                // Make use of ScanbotSDK utility function flash to indicate that a document has been detected
                this.sdk?.utils.flash();
                await this.addDocument(e);
            },
            onError: (error: Error) => {
                console.log("Encountered error scanning documents: ", error);
            },
            style: {
                // Note that alternatively, styling the document scanner is also possible using CSS classes.
                // For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
                outline: {
                    polygon: {
                        strokeCapturing: "green",
                        strokeWidthCapturing: 4,
                    },
                },
            },
        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    public async createBarcodeScanner(containerId: string, onBarcodesDetected: (e: BarcodeScannerResultWithSize) => void) {

        /*
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the document url scanner directly.
        */
        await this.initialize();

        const config: BarcodeScannerViewConfiguration = {
            containerId: containerId,
            overlay: {
                visible: true,

                textFormat: 'TextAndFormat',
                automaticSelectionEnabled: false,
                style: {
                    highlightedTextColor: '#EC3D67',
                    highlightedPolygonStrokeColor: '#3DEC4A'
                },
            },
            onBarcodesDetected: onBarcodesDetected,
            onError: (error: Error) => {
                console.log("Encountered error scanning barcodes: ", error);
            },
        };

        this.barcodeScanner = await this.sdk?.createBarcodeScanner(config);
    }

    public async disposeDocumentScanner() {
        this.documentScanner?.dispose();
    }

    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }

    async addDocument(response: DocumentScannerScanResponse) {
        const id = await this.storage?.storeCroppedDetectionResult(response);
        const retrieved = await this.storage?.getCroppedDetectionResult(id!);
        if (retrieved) {
            this.documents.push(retrieved);
        }
    }

    public async getDocuments() {
        await ScanbotSDKService.instance.loadDocuments();
        return this.documents;
    }

    async getDocument(id: string | undefined): Promise<SBStoreCroppedDetectionResult | undefined> {
        await ScanbotSDKService.instance.loadDocuments();

        if (!id) {
            return;
        }

        return this.documents.find((d) => d.id === parseInt(id));
    }

    async getDisplayImage(response: DocumentScannerScanResponse): Promise<Image | undefined> {
        if (!response.result?.croppedImage && !response.originalImage) {
            console.warn("No image available in the response to display.");
            return undefined;
        }
        return response.result?.croppedImage ?? response.originalImage;
    }

    async responseToJpeg(response: DocumentScannerScanResponse): Promise<Uint8Array | undefined> {
        const image = await this.getDisplayImage(response);
        if (!image) {
            return undefined;
        }
        return this.sdk?.imageToJpeg(image);
    }

    public async toDataUrl(document: DocumentScannerScanResponse) {
        return this.sdk?.toDataUrl(
            await this.sdk?.imageToJpeg(
                document.result?.croppedImage ?? document.originalImage
            )
        );
    }

    async openCroppingView(containerId: string, id: string | undefined) {
        const document = await this.getDocument(id);
        if (!document) {
            return;
        }

        console.log("Opening cropping view for document: ", document);

        const configuration: CroppingViewConfiguration = {
            containerId: containerId,
            image: document.originalImage,
            // TODO polygon no longer exists. either use points or points normalized
            polygon: document.result.detectionResult.pointsNormalized,
            disableScroll: true,
            // In this example we do not store rotations, but you can use them to rotate the image
            rotations: 0,
            style: {
                padding: 20,
                polygon: {
                    color: "green",
                    width: 4,
                    handles: {
                        size: 14,
                        color: "white",
                        border: "1px solid lightgray",
                    },
                },
                magneticLines: {
                    // disabled: true,
                    color: "red",
                },
            },
        };

        this.croppingView = await this.sdk?.openCroppingView(configuration);
    }

    async applyCrop(id: string | undefined) {
        const result = await this.croppingView?.apply();

        const document = await this.getDocument(id);
        if (!document || !result) {
            return
        }

        // (document.result as never)["croppedImage"] = result.image;
        // document.result.detectionResult.polygon = result?.polygon;

        // TODO impl. update function for SBStoreCroppedDetectionResult
        // await this.storage?.storeCroppedDetectionResult(document.result as SBStoreCroppedDetectionResult);
    }

}

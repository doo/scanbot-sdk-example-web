
import type ScanbotSDK from 'scanbot-web-sdk';


import StorageService from './storage-service';
import Utils from '../utils/utils';
import type {
    BarcodeScannerResultWithSize,
    BarcodeScannerViewConfiguration,
    DocumentScannerViewConfiguration,
    IBarcodeScannerHandle,
    ICroppingViewHandle,
    IDocumentScannerHandle,
    Polygon,
    CroppedDetectionResult,
    Image,
    CroppingViewConfiguration,
} from 'scanbot-web-sdk/@types';
import type { RawImage } from "scanbot-web-sdk/@types/core/bridge/common";

export class ScanbotDocument {
    id?: string;
    base64?: string;
    cropped?: Uint8Array;
    original!: Uint8Array;
    polygon?: Polygon;
    rotations?: number;
}

export default class ScanbotSDKService {

    public static instance: ScanbotSDKService = new ScanbotSDKService();

    private sdk?: ScanbotSDK;

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;
    private croppingView?: ICroppingViewHandle;

    private documents!: ScanbotDocument[];

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

    public async loadDocuments() {
        if (!this.documents) {
            this.documents = await StorageService.INSTANCE.getDocuments();
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
            onDocumentDetected: async (e: CroppedDetectionResult) => {
                console.log("Detected document!");

                // Make use of ScanbotSDK utility function flash to indicate that a document has been detected
                this.sdk?.utils.flash();

                // Pre-process the image to be displayed in the image result gallery.
                const base64 = await ScanbotSDKService.instance.toDataUrl(e);
                await this.addDocument(base64, e);
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

    async addDocument(base64: string | undefined, result: CroppedDetectionResult) {
        const document = {
            id: Utils.generateId(),
            base64: base64,
            original: await this.sdk!.imageToJpeg(result.originalImage),
            cropped: await this.sdk!.imageToJpeg(result.croppedImage ?? result.originalImage),
            polygon: result.pointsNormalized
        };

        this.documents.push(document);
        console.log("adding document", document);

        await StorageService.INSTANCE.storeDocument(document);
    }

    public async getDocuments() {
        await ScanbotSDKService.instance.loadDocuments();
        return this.documents;
    }

    async getDocument(id: string | undefined): Promise<ScanbotDocument | undefined> {
        await ScanbotSDKService.instance.loadDocuments();
        return this.documents.find((d) => d.id === id);
    }

    public async toDataUrl(document: CroppedDetectionResult) {
        return this.sdk?.toDataUrl(
            await this.sdk?.imageToJpeg(
                document.croppedImage ?? document.originalImage
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
            image: document.original,
            polygon: document.polygon,
            disableScroll: true,
            rotations: document.rotations ?? 0,
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
        if (!document) {
            return
        }

        document.cropped = await this.sdk?.imageToJpeg(result!.image);
        document.polygon = result?.polygon;
        document.rotations = result?.rotations;

        document.base64 = await this.sdk?.toDataUrl(document.cropped ?? document.original);

        await StorageService.INSTANCE.storeDocument(document);
    }

}
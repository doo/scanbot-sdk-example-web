import ScanbotSDK from "scanbot-web-sdk";
import { IBarcodeScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle";
import { ICroppingViewHandle } from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";
import { IDocumentScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import { Barcode } from "scanbot-web-sdk/@types/model/barcode/barcode";
import { BarcodeResult } from "scanbot-web-sdk/@types/model/barcode/barcode-result";
import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration";
import { CroppingViewConfiguration } from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import { DocumentScannerConfiguration } from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types/model/document/document-detection-result";

export default class ScanbotSDKService {

    public static instance: ScanbotSDKService = new ScanbotSDKService();

    sdk?: ScanbotSDK;

    /*
    * TODO add the license key here.
    * Please note: Scanbot Web SDK will run without a license key for one minute per session!
    * After the trial period has expired, all SDK functions and UI components will stop working.
    * You can get a free "no-strings-attached" trial license.
    * Please submit the trial license form (https://scanbot.io/trial/) on our website using
    * "Web SDK" as the license type and a corresponding domain name of your test environment 
    * (e.g. myapp.example.com or www.mywebsite.com). Every trial license automatically 
    * includes "localhost" as a domain name for local development purposes.
    */
    LICENSE_KEY = "";

    public async initialize() {
        if (this.sdk && this.sdk.initialized) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }

        // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
        // and attempt to load it before the 'window' object becomes available.
        // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
        const sdk = (await import('scanbot-web-sdk')).default;

        this.sdk = await sdk.initialize({
            licenseKey: this.LICENSE_KEY,
        });
    }

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;
    private croppingView?: ICroppingViewHandle;

    public async createDocumentScanner(containerId: string) {
        /* 
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the document url scanner directly. 
        */
        await this.initialize();

        const config: DocumentScannerConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e: DocumentDetectionResult) => {

                // Assign each document resul an identifier to access its details later
                // and pre-process the image into a base64 string for display
                const id = (Math.random() + 1).toString(36).substring(7);
                const base64 = await ScanbotSDKService.instance.sdk!.toDataUrl(e.cropped ?? e.original);
                this.documents.push({ id: id, image: base64, result: e });

                // Make use of ScanbotSDK utility function flash to indicate that a document has been detected
                this.sdk?.utils.flash();
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
                        strokeWidth: 4,
                    },
                },
            },
        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    async createBarcodeScanner(containerId: string, onBarcodeFound: (code: Barcode) => void) {
        /* 
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the barcode url scanner directly. 
        */
        await this.initialize();

        const config: BarcodeScannerConfiguration = {
            containerId: containerId,
            overlay: {
                visible: true,

                textFormat: 'TextAndFormat',
                automaticSelectionEnabled: false,
                style: {
                    highlightedTextColor: '#EC3D67',
                    highlightedPolygonStrokeColor: '#3DEC4A'
                },
                onBarcodeFound(code, polygon, label) {
                    // If overlay is visible and automatic selection is disabled, this callback will be called.
                    // The found overlay can be styled via the 'polygon' and 'label' parameters.
                    // However, in this case we just return the code to the view and show a toast
                    onBarcodeFound(code);
                },
            },
            returnBarcodeImage: true,
            style: { window: { widthProportion: 0.8, } },
            onBarcodesDetected: (e: BarcodeResult) => {
                // Process the result as you see fit
                console.log("Detected barcodes: ", e.barcodes);
            },
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


    private documents: ScanbotDocument[] = [];
    public getDocuments() {
        return this.documents;
    }
    public hasDocuments() {
        return this.documents.length > 0;
    }
    findDocument(id: string) {
        return this.getDocuments().find(d => d.id === id);
    }

    async openCroppingView(containerId: string, id: string | undefined) {

        if (!id) {
            console.log("No document id provided");
            return;
        }

        const document = this.findDocument(id)?.result;
        if (!document) {
            console.log("No document found for id: ", id);
            return;
        }

        console.log("Opening cropping view for document: ", document);

        const configuration: CroppingViewConfiguration = {
            containerId: containerId,
            image: document.original as Uint8Array,
            polygon: document.polygon,
            disableScroll: true,
            // rotations: document.rotations ?? 0,
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

    /**
     * Callback for when the user has applied a crop to a document.
     * <Link> redirects the user back before async operations have completed,
     * so we need to call this function to update the view after crop operation has been completed
     */
    onCropApplied: () => void = () => { };

    async applyCrop(id: string) {
        const result = await this.croppingView?.apply();
        const document = this.findDocument(id);
        if (!document) {
            return;
        }
        document.result!.cropped = result?.image;
        document.result!.polygon = result?.polygon;

        document.image = await ScanbotSDKService.instance.sdk!.toDataUrl(result?.image!);
        this.onCropApplied();
    }
}

/**
 * Wrapper object to conveniently display the image of a detection result
 * the 'image' object is pre-processed into a base64 string for display
 */
export class ScanbotDocument {
    id?: string;
    image?: string;
    result?: DocumentDetectionResult;
}
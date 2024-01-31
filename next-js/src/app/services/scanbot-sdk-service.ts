import ScanbotSDK from "scanbot-web-sdk";
import { IBarcodeScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle";
import { IDocumentScannerHandle } from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import { BarcodeResult } from "scanbot-web-sdk/@types/model/barcode/barcode-result";
import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration";
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
        // Use dynamic inline imports to load the SDK, 
        // as Next.js may attempt to load it before the 'window' object becomes available.
        // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
        const sdk = (await import('scanbot-web-sdk')).default;

        this.sdk = await sdk.initialize({
            licenseKey: this.LICENSE_KEY,
        });
    }

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;

    public async createDocumentScanner(containerId: string) {
        /* 
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the document url scanner directly. 
        */
        await this.initialize();

        const config: DocumentScannerConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e: DocumentDetectionResult) => {

                // Process the result as you see fit
                console.log("Detected document!");

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

    async createBarcodeScanner(containerId: string) {
        /* 
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the document url scanner directly. 
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
                    console.log('Found barcode:', code);
                },
            },
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
}
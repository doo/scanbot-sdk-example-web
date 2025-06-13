import ScanbotSDK from "scanbot-web-sdk";
import {
    IDocumentScannerHandle,
    IBarcodeScannerHandle,
    ICroppingViewHandle,
    BarcodeItem,
    BarcodeScannerViewConfiguration,
    CroppingViewConfiguration,
    DocumentScannerViewConfiguration,
    DocumentScanningResult, DocumentScannerScanResponse
} from "scanbot-web-sdk/@types";

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
        if (this.sdk) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }

        // Use dynamic inline imports to load the SDK, else Next will load it into the server bundle
        // and attempt to load it before the 'window' object becomes available.
        // https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading
        const sdk = (await import('scanbot-web-sdk')).default;

        this.sdk = await sdk.initialize({
            licenseKey: this.LICENSE_KEY,
            enginePath: "/wasm",
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

        const config: DocumentScannerViewConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e) => {

                // Assign each document resul an identifier to access its details later
                // and pre-process the image into a base64 string for display
                const id = (Math.random() + 1).toString(36).substring(7);
                const image = e.result.croppedImage ?? e.originalImage;
                const jpeg = await ScanbotSDKService.instance.sdk!.imageToJpeg(image);
                const base64 = await ScanbotSDKService.instance.sdk!.toDataUrl(jpeg);
                this.documents.push({ id: id, image: base64, response: e });

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
                        strokeWidthCapturing: 2,
                    },
                },
            },
        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    async createBarcodeScanner(containerId: string, onBarcodeFound: (code: BarcodeItem) => void) {
        /*
        * Ensure the SDK is initialized. If it's initialized, this function does nothing,
        * but is necessary e.g. when opening the barcode url scanner directly.
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
                onBarcodeFound(code, polygon, label) {
                    // If overlay is visible and automatic selection is disabled, this callback will be called.
                    // The found overlay can be styled via the 'polygon' and 'label' parameters.
                    // However, in this case we just return the code to the view and show a toast
                    onBarcodeFound(code);
                },
            },
            onBarcodesDetected: (e) => {
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

        const document = this.findDocument(id)?.response;
        if (!document) {
            console.log("No document found for id: ", id);
            return;
        }

        console.log("Opening cropping view for document: ", document);

        const configuration: CroppingViewConfiguration = {
            containerId: containerId,
            image: document.originalImage,
            polygon: document.result.detectionResult.pointsNormalized,
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
        const scanningResult = document.response?.result;
        if (scanningResult) {
            // Scanbot SDK data types are immutable, but javascript is just a wrapper for json and is fundamentally not.
            // Quick workaround to cast it to any time to update the properties
            (scanningResult as any).croppedImage = result?.image ?? null;
            (scanningResult.detectionResult as any).pointsNormalized = result?.polygon ?? [];
        }


        document.image = await ScanbotSDKService.instance.sdk!.toDataUrl(
            await ScanbotSDKService.instance.sdk!.imageToJpeg(result?.image!)
        );
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
    response?: Writeable<DocumentScannerScanResponse>;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

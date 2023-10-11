
import type ScanbotSDK from 'scanbot-web-sdk';

import type { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import type { IDocumentScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-document-scanner-handle';

import type { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration';
import type { DocumentScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/document-scanner-configuration';

import type { DocumentDetectionResult } from 'scanbot-web-sdk/@types/model/document/document-detection-result';
import type { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';

export class Document {
    id?: number;
    base64?: string;
    result?: DocumentDetectionResult;
}

export default class ScanbotSDKService {

    public static instance: ScanbotSDKService = new ScanbotSDKService();

    private sdk?: ScanbotSDK;

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;

    private documents: Document[] = [];

    public async initialize() {

        if (this.sdk && this.sdk.initialized) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }
        // Use dyanic inline imports to load the SDK else SvelteKit will try to load it before 'window' object is available
        // Also note that this initialize function is called after a svelte component is mounted
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({ licenseKey: '' });
    }

    public async createDocumentScanner(containerId: string) {
        const config: DocumentScannerConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e: DocumentDetectionResult) => {
                console.log("Detected document!");

                // Make use of ScanbotSDK utility function flash to indicate that a document has been detected
                this.sdk?.utils.flash();

                // Pre-process the image to be displayed in the image result gallery.
                const base64 = await ScanbotSDKService.instance.toDataUrl(e);

                this.documents.push({ id: Math.floor(Math.random() * 10000), base64: base64, result: e });
            },
            onError: (error: Error) => {
                console.log("Encountered error scanning documents: ", error);
            }

        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    public async disposeDocumentScanner() {
        this.documentScanner?.dispose();
    }

    public getDocuments() {
        return this.documents;
    }

    getDocument(id: string | null): Document | undefined {
		return this.documents.find((d) => d.id === Number(id));
	}

    public async toDataUrl(document: DocumentDetectionResult) {
        return await this.sdk?.toDataUrl(document.cropped ?? document.original);
    }

    public async createBarcodeScanner(containerId: string, onBarcodesDetected: (e: BarcodeResult) => void) {
        const config: BarcodeScannerConfiguration = {
            containerId: containerId,
            style: { window: { widthProportion: 0.8, } },
            onBarcodesDetected: onBarcodesDetected,
            onError: (error: Error) => {
                console.log("Encountered error scanning barcodes: ", error);
            },
        };

        this.barcodeScanner = await this.sdk?.createBarcodeScanner(config);
    }

    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }
}
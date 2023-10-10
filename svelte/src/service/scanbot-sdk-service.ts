
import type ScanbotSDK from 'scanbot-web-sdk';
import type { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import type { IDocumentScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-document-scanner-handle';
import type { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';
import type { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration';
import type { DocumentScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/document-scanner-configuration';
import type { DocumentDetectionResult } from 'scanbot-web-sdk/@types/model/document/document-detection-result';

export default class ScanbotSDKService {
    
    public static instance: ScanbotSDKService = new ScanbotSDKService();
    
    private sdk?: ScanbotSDK;

    private documentScanner?: IDocumentScannerHandle;
    private barcodeScanner?: IBarcodeScannerHandle;

    public async initialize() {
        // Use dyanic runtime imports to load the SDK else SvelteKit will try to load it before 'window' object is available
        // Also note that initialize is called after a svelte component is mounted
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({ licenseKey: '' });
    }

    public async createDocumentScanner(containerId: string) {
        const config: DocumentScannerConfiguration = {
            containerId : containerId,
            onDocumentDetected: (e: DocumentDetectionResult) => {
                console.log("Found document: ", JSON.stringify(e));
            },
            onError: (error: Error) => {
                console.log("Encountered error in DocumentScanner: ", error);
            }

        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    public async disposeDocumentScanner() {
        this.documentScanner?.dispose();
    }

    public async createBarcodeScanner(containerId: string) {
        const config: BarcodeScannerConfiguration = {
            containerId : containerId,
            style: {
                window: {
                    widthProportion: 0.8,
                }
            },
            onBarcodesDetected: (e: BarcodeResult) => {
                console.log("Found barcode: ", JSON.stringify(e));
            },
            onError: (error: Error) => {
                console.log("Encountered error in BarcodeScanner: ", error);
            },
        };

        this.barcodeScanner = await this.sdk?.createBarcodeScanner(config);
    }

    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }
}
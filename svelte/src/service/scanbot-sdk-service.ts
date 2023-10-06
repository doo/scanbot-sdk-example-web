import type ScanbotSDK from 'scanbot-web-sdk';
import type { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import type { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';
import type { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration';

export default class ScanbotSDKService {
    
    public static instance: ScanbotSDKService = new ScanbotSDKService();
    
    private sdk?: ScanbotSDK;
    barcodeScanner?: IBarcodeScannerHandle;

    public async initialize() {
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({ licenseKey: '' });
    }

    public async createBarcodeScanner(containerId: string) {
        const config: BarcodeScannerConfiguration = {
            containerId : containerId,
            onError: (error: unknown) => {
                console.log("Encountered error in BarcodeScanner: ", error);
            },
            onBarcodesDetected: (e: BarcodeResult) => {
                console.log("Found barcode: ", JSON.stringify(e));
            }
        };

        console.log("sdk", this.sdk);
        this.barcodeScanner = await this.sdk?.createBarcodeScanner(config);
    }

    public disposeBarcodeScanner() {
        this.barcodeScanner?.dispose();
    }
}
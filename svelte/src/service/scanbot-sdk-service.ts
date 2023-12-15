
import type ScanbotSDK from 'scanbot-web-sdk';

import type { IBarcodeScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-barcode-scanner-handle';
import type { IDocumentScannerHandle } from 'scanbot-web-sdk/@types/interfaces/i-document-scanner-handle';

import type { BarcodeScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/barcode-scanner-configuration';
import type { DocumentScannerConfiguration } from 'scanbot-web-sdk/@types/model/configuration/document-scanner-configuration';

import type { DocumentDetectionResult } from 'scanbot-web-sdk/@types/model/document/document-detection-result';
import type { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';
import type { CroppingViewConfiguration } from 'scanbot-web-sdk/@types/model/configuration/cropping-view-configuration';
import type { ICroppingViewHandle } from 'scanbot-web-sdk/@types/interfaces/i-cropping-view-handle';
import StorageService from './storage-service';
import Utils from '../utils/utils';
import type { Polygon } from 'scanbot-web-sdk/@types/utils/dto/Polygon';

export class ScanbotDocument {
    id?: string;
    base64?: string;
    cropped?: Uint8Array | string; 
    original!: Uint8Array | string;
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

        if (this.sdk && this.sdk.initialized) {
            // The SDK needs to be initialized just once during the entire app's lifecycle
            return;
        }
        // Use dynamic inline imports to load the SDK, as SvelteKit may attempt to load it before the 'window' object becomes available.
        // Please be aware that this initialization function is invoked after a Svelte component has been mounted.
        const sdk = (await import('scanbot-web-sdk')).default;
        this.sdk = await sdk.initialize({
            licenseKey: '',
            // You can also use CDN to load the correct SDK binary, but be sure to use the correct version number
            // engine: "https://cdn.jsdelivr.net/npm/scanbot-web-sdk@latest/bundle/bin/barcode-scanner/"
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

        const config: DocumentScannerConfiguration = {
            containerId: containerId,
            onDocumentDetected: async (e: DocumentDetectionResult) => {
                console.log("Detected document!");

                // Make use of ScanbotSDK utility function flash to indicate that a document has been detected
                this.sdk?.utils.flash();

                // Pre-process the image to be displayed in the image result gallery.
                const base64 = await ScanbotSDKService.instance.toDataUrl(e);
                await this.addDocument(base64, e);
            },
            onError: (error: Error) => {
                console.log("Encountered error scanning documents: ", error);
            }

        };
        this.documentScanner = await this.sdk?.createDocumentScanner(config);
    }

    public async createBarcodeScanner(containerId: string, onBarcodesDetected: (e: BarcodeResult) => void) {

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
            },
            style: { window: { widthProportion: 0.8, } },
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

    async addDocument(base64: string | undefined, result: DocumentDetectionResult) {
        const document = {
            id: Utils.generateId(),
            base64: base64,
            original: result.original,
            cropped: result.cropped,
            polygon: result.polygon
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

    public async toDataUrl(document: DocumentDetectionResult) {
        return await this.sdk?.toDataUrl(document.cropped ?? document.original);
    }

    async openCroppingView(containerId: string, id: string | undefined) {
        const document = await this.getDocument(id);
        if (!document) {
            return;
        }

        console.log("Opening cropping view for document: ", document);
        console.log(document.original.length, document.original.slice(0, 10));

        const configuration: CroppingViewConfiguration = {
            containerId: containerId,
            image: document.original as Uint8Array,
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

        document.cropped = result?.image;
        document.polygon = result?.polygon;
        document.rotations = result?.rotations;

        document.base64 = await this.sdk?.toDataUrl((document.cropped ?? document.original) as Uint8Array);

        StorageService.INSTANCE.storeDocument(document);
    }

}
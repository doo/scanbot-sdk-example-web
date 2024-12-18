// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk";

// Other typings should be imported from @types
import {
	IDocumentScannerHandle,
	CroppingViewConfiguration,
	ICroppingViewHandle,
	IBarcodeScannerHandle,
	TiffGenerator,
	PdfGenerator,
	Polygon,
	CroppedDetectionResult,
	DocumentScannerViewConfiguration,
	BarcodeScannerViewConfiguration,
	MrzScannerViewConfiguration,
	TextPatternScannerViewConfiguration,
	VinScannerViewConfiguration,
	VinScannerResult, IMrzScannerHandle, ITextPatternScannerHandle, BarcodeFormat,
	UIConfig, PdfConfiguration, TiffGeneratorParameters, Image
} from "scanbot-web-sdk/@types";

import Pages from "../model/pages";
import { ImageUtils } from "../utils/image-utils";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types/core-types";

export const Filters = {
	"ScanbotBinarizationFilter": ScanbotSDK.Config.ScanbotBinarizationFilter,
	"GrayscaleFilter": ScanbotSDK.Config.GrayscaleFilter,
	"ContrastFilter": ScanbotSDK.Config.ContrastFilter,
	"ColorDocumentFilter": ScanbotSDK.Config.ColorDocumentFilter,
	"WhiteBlackPointFilter": ScanbotSDK.Config.WhiteBlackPointFilter,
}

export class ScanbotSdkService {

	static DOCUMENT_SCANNER_CONTAINER = "document-scanner-view";
	static CROPPING_VIEW_CONTAINER = "cropping-view";
	static BARCODE_SCANNER_CONTAINER = "barcode-scanner-view";
	static MRZ_SCANNER_CONTAINER = "mrz-scanner-view";
	static TEXTDATA_SCANNER_CONTAINER = "text-data-scanner-view";
	static VIN_SCANNER_CONTAINER = "vin-scanner-view";

	public static instance = new ScanbotSdkService();

	license = "";

	sdk?: ScanbotSDK;

	documentScanner?: IDocumentScannerHandle;
	barcodeScanner?: IBarcodeScannerHandle;
	mrzScanner?: IMrzScannerHandle;
	textDataScanner?: ITextPatternScannerHandle;
	vinScanner?: ITextPatternScannerHandle;
	croppingView?: ICroppingViewHandle;

	public async initialize() {
		this.sdk = await ScanbotSDK.initialize({
			licenseKey: this.license,
			// WASM files are copied to this directory by the npm postinstall script
			enginePath: './wasm/'
		});
		return this.sdk;
	}

	async setLicenseFailureHandler(callback: any) {
		await this.setLicenceTimeout(callback);
	}

	private async setLicenceTimeout(callback: any) {
		// Scanbot WebSDK does not offer real-time license failure handler. Simply loop to check it manually
		const info = await this.sdk?.getLicenseInfo();
		if (info && info.status !== "Trial" && info.status !== "Okay") {
			callback(info.description);
		} else {
			setTimeout(() => {
				this.setLicenceTimeout(callback);
			}, 2000);
		}
	}
	public async isLicenseValid(): Promise<boolean> {
		const info = await this.sdk?.getLicenseInfo();
		if (!info) {
			return false;
		}
		return info.isValid();
	}

	public async createDocumentQualityAnalyzer() {
		return this.sdk?.createDocumentQualityAnalyzer();
	}

	public async analyzeDocumentQuality(result: CroppedDetectionResult) {
		/**
		 * Initialization of the analyzer can cause a strain on your user interface,
		 * In a real-life scenario, consider creating the analyzer once on app/scanner startup, not for every scan.
		 */
		const analyzer = await ScanbotSdkService.instance.createDocumentQualityAnalyzer();
		console.log('Document quality analysis:', await analyzer?.analyze(result.originalImage));
		await analyzer?.release();
	}

	public async createDocumentScanner(detectionCallback: (e: CroppedDetectionResult) => void, errorCallback: (e: Error) => void) {
		const config: DocumentScannerViewConfiguration = {
			onDocumentDetected: detectionCallback,
			containerId: ScanbotSdkService.DOCUMENT_SCANNER_CONTAINER,
			text: {
				hint: {
					OK: "Capturing your document...",
					OK_BUT_TOO_SMALL: "The document is too small. Try moving closer.",
					OK_BUT_BAD_ANGLES:
						"This is a bad camera angle. Hold the device straight over the document.",
					OK_BUT_BAD_ASPECT_RATIO:
						"Rotate the device sideways, so that the document fits better into the screen.",
					OK_BUT_OFF_CENTER: "Try holding the device at the center of the document.",
					ERROR_NOTHING_DETECTED:
						"Please hold the device over a document to start scanning.",
					ERROR_TOO_DARK: "It is too dark. Try turning on a light.",
					ERROR_TOO_NOISY: "Please move the document to a clear surface.",
					NOT_ACQUIRED: "No document detected.",
					OK_BUT_ORIENTATION_MISMATCH: "The document seems to be upside down. Please rotate the device or document",
					OK_BUT_TOO_DARK: "A document was detected, but it is too dark. Try turning on a light.",
				},
			},
			style: {
				// Note that alternatively, styling the document scanner is also possible using CSS classes.
				// For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
				outline: {
					polygon: {
						fillCapturing: "rgba(0, 255, 0, 0.2)",
						strokeCapturing: "green",
						fillSearching: "rgba(255, 0, 0, 0.2)",
						strokeSearching: "red",
					}
				}
			},
			onError: errorCallback,
			preferredCamera: 'camera2 0, facing back'
		};
		this.documentScanner = await this.sdk!.createDocumentScanner(config);
	}

	public disposeDocumentScanner() {
		this.documentScanner?.dispose();
	}

	public async createBarcodeScanner(callback: any, errorCallback: (e: Error) => void, additionalConfig: any = {}) {
		const barcodeFormats: BarcodeFormat[] = [
			"AZTEC",
			"CODABAR",
			"CODE_39",
			"CODE_93",
			"CODE_128",
			"DATA_MATRIX",
			"EAN_8",
			"EAN_13",
			"ITF",
			"MAXI_CODE",
			"PDF_417",
			"QR_CODE",
			"DATABAR",
			"DATABAR_EXPANDED",
			"UPC_A",
			"UPC_E",
			"MSI_PLESSEY",
			"IATA_2_OF_5",
			"INDUSTRIAL_2_OF_5",
			"CODE_25",
			"MICRO_QR_CODE",
			"USPS_INTELLIGENT_MAIL",
			"ROYAL_MAIL",
			"JAPAN_POST",
			"ROYAL_TNT_POST",
			"AUSTRALIA_POST",
			"DATABAR_LIMITED",
			"MICRO_PDF_417",
			"GS1_COMPOSITE",
			"RMQR_CODE",
			"CODE_11",
			"CODE_32",
			"PHARMA_CODE",
			"PHARMA_CODE_TWO_TRACK",
			"PZN",
		];

		const config: BarcodeScannerViewConfiguration = {
			containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER,
			captureDelay: 1000,
			onBarcodesDetected: callback,
			barcodeFormats: barcodeFormats,
			onError: errorCallback,
			preferredCamera: 'camera2 0, facing back',
			finder: {
				visible: true,
				style: {
					_type: "FinderStrokedStyle",
					cornerRadius: 5,
					strokeColor: "white",
					strokeWidth: 1,
				},
				aspectRatio: {
					width: 1,
					height: 1,
				},
				overlayColor: "rgba(0, 0, 0, 0.5)",
			} as UIConfig.ViewFinderConfiguration,
			userGuidance: {
				visible: true,
				title: {
					text: "Move the finder over a barcode",
					color: "white",
				},
				background: {
					strokeColor: "green",
					fillColor: "rgba(0, 255, 0, 0.2)",
				}
			} as UIConfig.UserGuidanceConfiguration,
			...additionalConfig
		};

		this.barcodeScanner = await this.sdk!.createBarcodeScanner(config);
	}

	public disposeBarcodeScanner() {
		this.barcodeScanner?.dispose();
	}

	public async createMrzScanner(onMrzDetected: any, errorCallback: (e: Error) => void) {
		const config: MrzScannerViewConfiguration = {
			containerId: ScanbotSdkService.MRZ_SCANNER_CONTAINER,
			onMrzDetected: onMrzDetected,
			onError: errorCallback,
			preferredCamera: 'camera2 0, facing back'
		};

		this.mrzScanner = await this.sdk!.createMrzScanner(config);
	}

	public disposeMrzScanner() {
		this.mrzScanner?.dispose();
	}

	public disposeTextDataScanner() {
		this.textDataScanner?.dispose();
	}

	public disposeVINScanner() {
		this.vinScanner?.dispose();
	}

	public async createTextPatternScanner(onTextDetected: any, errorCallback: (e: Error) => void) {
		const config: TextPatternScannerViewConfiguration = {
			containerId: ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER,
			onTextDetected: onTextDetected,
			onError: errorCallback,
			preferredCamera: 'camera2 0, facing back'
		};

		this.textDataScanner = await this.sdk!.createTextPatternScanner(config);
	}

	public async createVINScanner(onVINDetected: any, errorCallback: (e: Error) => void) {

		const config: VinScannerViewConfiguration = {
			containerId: ScanbotSdkService.VIN_SCANNER_CONTAINER,
			onVinDetected: (e: VinScannerResult) => {
				console.log("VIN detected: ", e);
				onVINDetected(e);
			},
			onError: errorCallback,
		}

		this.vinScanner = await this.sdk!.createVinScanner(config);
	}

	public async openCroppingView(page: any) {
		const configuration: CroppingViewConfiguration = {
			containerId: ScanbotSdkService.CROPPING_VIEW_CONTAINER,
			image: page.original,
			polygon: page.polygon,
			rotations: page.rotations ?? 0,
		};

		this.croppingView = await this.sdk!.openCroppingView(configuration);
	}

	public disposeCroppingView() {
		this.croppingView?.dispose();
	}

	public availableFilters() {
		return ["none"].concat(Object.keys(Filters)) as ("none" | keyof typeof Filters)[];
	}

	public filterNameByIndex(value: string) {
		return this.availableFilters()[parseInt(value)];
	}

	public async applyFilter(image: Image, filterName: keyof typeof Filters) {
		const filter = new Filters[filterName]();
		return this.sdk!.imageFilter(image, filter);
	}

	async documentImageAsBase64(index: number) {
		const bytes = Pages.instance.imageAtIndex(index);
		if (bytes) {
			return await this.sdk!.toDataUrl(
				await this.sdk!.imageToJpeg(bytes)
			);
		}
	}

	async reapplyFilter() {
		const existing = Pages.instance.getActiveItem();
		if (!existing!.filter) {
			return;
		}
		existing!.filtered = await this.applyFilter(
			existing!.cropped!,
			existing!.filter
		);
	}

	async generatePDF(pages: any[]) {
		const options: Partial<PdfConfiguration> = {
			pageSize: "A4",
			pageDirection: "PORTRAIT",
			dpi: 300,
			jpegQuality: 95,
		};
		const generator: PdfGenerator = await this.sdk!.beginPdf(options);
		for (const page of pages) {
			let image = page.filtered ?? page.cropped ?? page.original;
			image = await this.sdk!.imageToJpeg(image);
			image = await ImageUtils.downscale(this.sdk!, image);
			await generator.addPage(image);
		}
		return await generator.complete();
	}

	async generateTIFF(pages: any[]) {
		const options: Partial<TiffGeneratorParameters> = {
			dpi: 72,
		};
		const generator: TiffGenerator = await this.sdk!.beginTiff(options);
		for (const page of pages) {
			let image = page.cropped ?? page.original;
			image = await this.sdk?.imageFilter(image, new ScanbotSDK.Config.ScanbotBinarizationFilter());
			await generator.addPage(image);
		}
		return await generator.complete();
	}

	async detectDocument(image: ArrayBuffer): Promise<DocumentDetectionResult> {
		return await this.sdk!.detectDocument(image);
	}

	async cropImage(image: ArrayBuffer, polygon: Polygon): Promise<Image> {
		return await this.sdk!.imageCrop(image, polygon);
	}
}

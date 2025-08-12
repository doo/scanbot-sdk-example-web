
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export async function startScanner(config?: UIConfig.BarcodeScannerScreenConfiguration) {
	// Configure as needed
	if (!config) {
		config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
	}
	const result = await ScanbotSDK.UI.createBarcodeScanner(config);
	// Process & present the result as needed
	return result;
}

export async function processResult(result: UIConfig.BarcodeScannerUiResult) {
	result.items.forEach((item) => {
		const barcode = item.barcode;
		// Handle the detected barcode(s) from result
		const text = barcode.text;
		const format = barcode.format;
		// The barcodeItem contains the scanned barcode data as ByteArray
		const bytes = barcode.rawBytes;
		// This is the image of the scanned barcode in raw pixel format. Use image?.toJpeg() to get an encoded variant
		const image = barcode.sourceImage;
	});
}

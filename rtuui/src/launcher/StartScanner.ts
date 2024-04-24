
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/ui2/configuration";

export default function startScanner(config: BarcodeScannerConfiguration) {
	// TODO: Configure as needed
	const result = ScanbotSDK.UI.createBarcodeScanner(config);
	// TODO: Process & present the result as needed
	return result;
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export default function startScanner(config: UIConfig.BarcodeScannerConfiguration) {
	// TODO: Configure as needed
	const result = ScanbotSDK.UI.createBarcodeScanner(config);
	// TODO: Process & present the result as needed
	return result;
}
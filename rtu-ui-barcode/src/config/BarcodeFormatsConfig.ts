
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyBarcodeFormatsConfig(config: UIConfig.BarcodeScannerConfiguration) {
    config.recognizerConfiguration.barcodeFormats = ["MICRO_QR_CODE", "PDF_417", "QR_CODE", "UPC_A"];
}
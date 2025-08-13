/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyTinyBarcodeConfig(config?: UIConfig.BarcodeScannerScreenConfiguration) {

    if (!config) {
        config = new UIConfig.BarcodeScannerScreenConfiguration();
    }

    config.scannerConfiguration.engineMode = "NEXT_GEN_FAR_DISTANCE";
}

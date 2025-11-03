/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyLocalizationConfig(config?: UIConfig.BarcodeScannerScreenConfiguration) {

    if (!config) {
        config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
    }
    // Hide/show the view finder.
    config.localization.barcodeInfoMappingErrorStateCancelButton = "Custom Cancel title"
    config.localization.cameraPermissionCloseButton = "Custom Close title"
}

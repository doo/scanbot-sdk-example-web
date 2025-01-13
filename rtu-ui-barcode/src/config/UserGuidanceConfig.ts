
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyUserGuidanceConfig(config: UIConfig.BarcodeScannerConfiguration) {

    // Hide/unhide the user guidance.
    config.userGuidance.visible = true;

    // Configure the title.
    config.userGuidance.title.text = "Move the finder over a barcode";
    config.userGuidance.title.color = "#FFFFFF";

    // Configure the background.
    config.userGuidance.background.fillColor = "#0000007A";
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/ui2/configuration";

export function applyTopBarConfig(config: BarcodeScannerConfiguration) {
    
    // Set the top bar mode.
    config.topBar.mode = "GRADIENT";

    // Set the background color which will be used as a gradient.
    config.topBar.backgroundColor = "#C8193C";

    // Configure the Cancel button.
    config.topBar.cancelButton.text = "Cancel";
    config.topBar.cancelButton.foreground.color = "#FFFFFF";
}
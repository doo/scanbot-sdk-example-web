
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";
export function createPaletteConfig() {

    const config = new ScanbotSDK.UI.Config.UserGuidanceConfiguration();
    
    // Hide/unhide the user guidance.
    config.visible = true;

    // Configure the title.
    config.title.text = "Move the finder over a barcode";
    config.title.color = "#FFFFFF";

    // Configure the background.
    config.background.fillColor = "#7A000000";

    return config;
}
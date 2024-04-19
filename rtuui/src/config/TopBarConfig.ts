
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";
export function createTopBarConfig() {

    const config = new ScanbotSDK.UI.Config.TopBarConfiguration();
    
    // Set the top bar mode.
    config.mode = "GRADIENT";

    // Set the background color which will be used as a gradient.
    config.backgroundColor = "#C8193C";

    // Configure the status bar look. If visible - select DARK or LIGHT according to your app's theme color.
    config.statusBarMode = "HIDDEN";

    // Configure the Cancel button.
    config.cancelButton.text = "Cancel";
    config.cancelButton.foreground.color = "#FFFFFF";

    return config;
}
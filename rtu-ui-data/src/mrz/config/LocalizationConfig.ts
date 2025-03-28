/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";

export function applyLocalizationConfig() {
    // For demonstration purposes, we create a new configuration object.
    const config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();

    config.localization.topUserGuidance = "This will be displayed at the top of the screen";
    config.localization.cameraPermissionCloseButton = "The 'close' button title of the camera permission dialog.";
}

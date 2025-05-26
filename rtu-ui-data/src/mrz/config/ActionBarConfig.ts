/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyActionBarConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    // Retrieve the instance of the action bar from the configuration object.
    const bar = config.actionBar

    // Show the flash button.
    bar.flashButton.visible = true

    // Configure the inactive state of the flash button.
    bar.flashButton.backgroundColor = "#7A000000";
    bar.flashButton.foregroundColor = "#FFFFFF";

    // Configure the active state of the flash button.
    bar.flashButton.activeBackgroundColor = "#FFCE5C";
    bar.flashButton.activeForegroundColor = "#000000";

    // Show the zoom button.
    bar.zoomButton.visible = true

    // Configure the zoom button.
    bar.zoomButton.backgroundColor = "#7A000000";
    bar.zoomButton.foregroundColor = "#FFFFFF";

    // Show the flip camera button.
    bar.flipCameraButton.visible = true

    // Configure the flip camera button.
    bar.flipCameraButton.backgroundColor = "#7A000000";
    bar.flipCameraButton.foregroundColor = "#FFFFFF";
}

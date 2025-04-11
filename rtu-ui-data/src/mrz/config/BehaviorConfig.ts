/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyBehaviorConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    // Configure camera properties.
    // e.g
    config.cameraConfiguration.zoomSteps = [1.0, 2.0, 5.0];
    config.cameraConfiguration.flashEnabled = false;

    // Configure the UI elements like icons or buttons.
    // e.g The top bar introduction button.
    config.topBarOpenIntroScreenButton.visible = true;
    config.topBarOpenIntroScreenButton.color = "#FFFFFF";
    // Cancel button.
    config.topBar.cancelButton.visible = true;
    config.topBar.cancelButton.text = "Cancel";
    config.topBar.cancelButton.foreground.color = "#FFFFFF";
    config.topBar.cancelButton.background.fillColor = "#00000000";

    // Configure the success overlay.
    config.successOverlay.iconColor = "#FFFFFF";
    config.successOverlay.message.text = "Scanned Successfully!";
    config.successOverlay.message.color = "#FFFFFF";

    // Configure the sound.
    config.sound.successBeepEnabled = true;
    config.sound.soundType = "MODERN_BEEP";

    // Configure the vibration.
    config.vibration.enabled = false;
}

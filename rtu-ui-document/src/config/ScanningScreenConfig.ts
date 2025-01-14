/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

export function applyScanningScreenConfig(config: UIConfig.DocumentScanningFlow) {
    
    // Configure the top user guidance.
    config.screens.camera.topUserGuidance.visible = true;
    config.screens.camera.topUserGuidance.background.fillColor = "#FF0000";
    config.screens.camera.topUserGuidance.title.text = "Scan your document";

    // Configure the bottom user guidance.
    config.screens.camera.userGuidance.visibility = "AUTO_CAPTURE_ONLY";
    config.screens.camera.userGuidance.background.fillColor = "#000000A4";
    config.screens.camera.userGuidance.title.text = "Please hold your device over a document";

    // Configure the the scanning assistance overlay.
    config.screens.camera.scanAssistanceOverlay.visible = true;
    config.screens.camera.scanAssistanceOverlay.backgroundColor = "#000000A4";
    config.screens.camera.scanAssistanceOverlay.foregroundColor = "#FFFFFF";

    // The title of the user guidance when the document is ready to be captured in manual mode.
    config.screens.camera.userGuidance.statesTitles.captureManual = "The document is ready to be captured";

    // Import button is used to import image from the gallery.
    config.screens.camera.bottomBar.importButton.visible = true;
    config.screens.camera.bottomBar.importButton.title.visible = true;
    config.screens.camera.bottomBar.importButton.title.text = "Import";

    // Configure the auto/manual snap button.
    config.screens.camera.bottomBar.autoSnappingModeButton.title.visible = true;
    config.screens.camera.bottomBar.autoSnappingModeButton.title.text = "Auto";
    config.screens.camera.bottomBar.manualSnappingModeButton.title.visible = true;
    config.screens.camera.bottomBar.manualSnappingModeButton.title.text = "Manual";

    // Configure the torch off/on button.
    config.screens.camera.bottomBar.torchOnButton.title.visible = true
    config.screens.camera.bottomBar.torchOnButton.title.text = "On"
    config.screens.camera.bottomBar.torchOffButton.title.visible = true
    config.screens.camera.bottomBar.torchOffButton.title.text = "Off"

    // Configure the feedback behavior when an image is captured.
    config.screens.camera.captureFeedback.cameraBlinkEnabled = true
    config.screens.camera.captureFeedback.snapFeedbackMode = new ScanbotSDK.UI.Config.PageSnapCheckMarkAnimation();

    // Limit how many pages can be captured.
    config.outputSettings.pagesScanLimit = 3;
    
}
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyAcknowledgeScreenConfig(config: UIConfig.DocumentScanningFlow) {
    const acknowledgeScreenConfig = config.screens.camera.acknowledgement;

    // Set the acknowledgment mode
    // Modes:
    // - `ALWAYS`: Runs the quality analyzer on the captured document and always displays the acknowledgment screen.
    // - `BAD_QUALITY`: Runs the quality analyzer and displays the acknowledgment screen only if the quality is poor.
    // - `NONE`: Skips the quality check entirely.
    acknowledgeScreenConfig.acknowledgementMode = "ALWAYS";

    // Set the minimum acceptable document quality.
    // Options: excellent, good, reasonable, poor, very_poor, or no_document.
    acknowledgeScreenConfig.minimumQuality = "REASONABLE";

    // Set the background color for the acknowledgment screen.
    acknowledgeScreenConfig.backgroundColor = "#EFEFEF";

    // You can also configure the buttons in the bottom bar of the acknowledgment screen,
    // e.g. to force the user to retake, if the captured document is not OK.
    acknowledgeScreenConfig.bottomBar.acceptWhenNotOkButton.visible = false;

    // Hide the titles of the buttons.
    acknowledgeScreenConfig.bottomBar.acceptWhenNotOkButton.title.visible = false;
    acknowledgeScreenConfig.bottomBar.acceptWhenOkButton.title.visible = false;
    acknowledgeScreenConfig.bottomBar.retakeButton.title.visible = false;

    // Configure the acknowledgment screen's hint message which is shown if the least acceptable quality is not met.
    acknowledgeScreenConfig.badImageHint.visible = true;
}
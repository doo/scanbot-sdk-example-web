/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applySinglePageScanningConfig(config: UIConfig.DocumentScanningFlow) {
    // Set the page limit.
    config.outputSettings.pagesScanLimit = 1;

    // Disable the tutorial screen.
    config.screens.camera.introduction.showAutomatically = false;

    // Enable the acknowledgment screen.
    config.screens.camera.acknowledgement.acknowledgementMode = "ALWAYS";

    // Disable the review screen.
    config.screens.review.enabled = false;
}
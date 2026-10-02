/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyReviewScreenConfig(config: UIConfig.DocumentScanningFlow) {
    // Enable / Disable the review screen.
    config.screens.review.enabled = true;

    // Hide the zoom button.
    config.screens.review.zoomButton.visible = false;

    // Hide the add & retake button.
    config.screens.review.toolbar.addButton.barButton.visible = false;
    config.screens.review.toolbar.retakeButton.barButton.visible = false;

    // Hide the reset button in the cropping screen.
    config.screens.cropping.toolbar.resetButton.visible = false;
}

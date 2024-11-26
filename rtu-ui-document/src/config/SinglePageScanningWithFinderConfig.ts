/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

export function applySinglePageScanningWithFinderConfig(config: UIConfig.DocumentScanningFlow) {
    // Set the page limit.
    config.outputSettings.pagesScanLimit = 1;

    // Enable the tutorial screen.
    config.screens.camera.introduction.showAutomatically = true;

    // Disable the acknowledgment screen.
    config.screens.camera.acknowledgement.acknowledgementMode = "NONE";

    // Disable the review screen.
    config.screens.review.enabled = false;

    // Set the visibility of the view finder.
    config.screens.camera.viewFinder.visible = true;

    config.screens.camera.viewFinder.style.cornerRadius = 10;
    config.screens.camera.viewFinder.style.strokeColor = "#FFFFFF";
    config.screens.camera.viewFinder.style.strokeWidth = 3;
    config.screens.camera.viewFinder.aspectRatio = new ScanbotSDK.Config.Geometry.AspectRatio({height: 1, width: 1});
}
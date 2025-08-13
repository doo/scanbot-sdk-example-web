/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig, Config } from "scanbot-web-sdk/@types";
import { FinderCorneredStyle } from "scanbot-web-sdk/@types/ui2/configuration/common/ViewFinderConfiguration";

export function applyViewFinderConfig(config?: UIConfig.BarcodeScannerScreenConfiguration) {

    if (!config) {
        config = new UIConfig.BarcodeScannerScreenConfiguration();
    }
    // Hide/show the view finder.
    config.viewFinder.visible = true;
    // Set the aspect ratio of the view finder
    config.viewFinder.aspectRatio = new Config.AspectRatio({ width: 16.0, height: 9.0 });

    config.viewFinder.style = new FinderCorneredStyle({
        // Set the color of the view finder corners
        strokeColor: "#00FF00",
        // Set the width of the view finder corners in dp
        strokeWidth: 10.0,
    })
}

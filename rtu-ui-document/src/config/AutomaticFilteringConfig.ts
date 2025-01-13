/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

export function applyAutomaticFiltering(config: UIConfig.DocumentScanningFlow) {
    // Set default filter with default values for the document scanner.
    config.outputSettings.defaultFilter = new ScanbotSDK.Config.ScanbotBinarizationFilter();

    //or you can set custom filter with custom values
    config.outputSettings.defaultFilter = new ScanbotSDK.Config.WhiteBlackPointFilter({
        blackPoint: 0.1,
        whitePoint: 0.9
    });
}
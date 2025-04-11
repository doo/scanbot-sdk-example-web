/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyGuidanceConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    // Top user guidance
    // Retrieve the instance of the top user guidance from the configuration object.
    const top = config.topUserGuidance;
    // Show the user guidance.
    top.visible = true;
    // Configure the title.
    top.title.text = "Scan your Identity Document";
    top.title.color = "#FFFFFF";
    // Configure the background.
    top.background.fillColor = "#7A000000";

    // Finder overlay user guidance
    // Retrieve the instance of the finder overlay user guidance from the configuration object.
    const finder = config.finderViewUserGuidance;
    // Show the user guidance.
    finder.visible = true;
    // Configure the title.
    finder.title.text = "Scan the MRZ";
    finder.title.color = "#FFFFFF";
    // Configure the background.
    finder.background.fillColor = "#7A000000";
}

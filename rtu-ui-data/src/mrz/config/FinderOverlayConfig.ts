/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";
import {
    FinderCorneredStyle,
    FinderStrokedStyle
} from "scanbot-web-sdk/@types/ui2/configuration/common/ViewFinderConfiguration";
import {
    NoLayoutPreset,
    ThreeLineMrzFinderLayoutPreset,
    TwoLineMrzFinderLayoutPreset
} from "scanbot-web-sdk/@types/ui2/configuration/mrz/MRZFinderLayoutPreset";

export function applyFinderOverlayConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    // To hide the example layout preset.
    config.mrzExampleOverlay = new NoLayoutPreset()

    // Configure the finder example overlay. You can choose between the two-line and three-line preset.
    // Each example preset has a default text for each line, but you can change it accordingly to your liking.
    // Each preset has a fixed aspect ratio adjusted to it's number of lines. To override, please use 'aspectRatio'
    // parameter in 'viewFinder' field in the main configuration object.

    // To use the default ones.
    config.mrzExampleOverlay = new TwoLineMrzFinderLayoutPreset()
    config.mrzExampleOverlay = new ThreeLineMrzFinderLayoutPreset()

    // Or configure the preset.
    // For this example we will configure the three-line preset.
    const preset = new ThreeLineMrzFinderLayoutPreset()
    preset.mrzTextLine1 = "I<USA2342353464<<<<<<<<<<<<<<<"
    preset.mrzTextLine2 = "9602300M2904076USA<<<<<<<<<<<2"
    preset.mrzTextLine3 = "SMITH<<JACK<<<<<<<<<<<<<<<<<<<"

    // Set the configured finder layout preset on the main configuration object.
    config.mrzExampleOverlay = preset

    // Configure the view finder.
    // Set the style for the view finder.
    // Choose between cornered or stroked style.
    // For default stroked style.
    config.viewFinder.style = new FinderStrokedStyle();
    // For default cornered style.
    config.viewFinder.style = new FinderCorneredStyle();
    // You can also set each style's stroke width, stroke color or corner radius, e.g.
    config.viewFinder.style = new FinderCorneredStyle({ strokeWidth: 3.0 });
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyPaletteConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    // Retrieve the instance of the palette from the configuration object.
    const palette = config.palette;

    // Configure the colors.
    // The palette already has the default colors set, so you don't have to always set all the colors.

    palette.sbColorPrimary = "#C8193C";
    palette.sbColorPrimaryDisabled = "#F5F5F5";
    palette.sbColorNegative = "#FF3737";
    palette.sbColorPositive = "#4EFFB4";
    palette.sbColorWarning = "#FFCE5C";
    palette.sbColorSecondary = "#FFEDEE";
    palette.sbColorSecondaryDisabled = "#F5F5F5";
    palette.sbColorOnPrimary = "#FFFFFF";
    palette.sbColorOnSecondary = "#C8193C";
    palette.sbColorSurface = "#FFFFFF";
    palette.sbColorOutline = "#EFEFEF";
    palette.sbColorOnSurfaceVariant = "#707070";
    palette.sbColorOnSurface = "#000000";
    palette.sbColorSurfaceLow = "#26000000";
    palette.sbColorSurfaceHigh = "#7A000000";
    palette.sbColorModalOverlay = "#A3000000";
}

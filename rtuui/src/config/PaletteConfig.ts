
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";
export function createPaletteConfig() {

    const config = new ScanbotSDK.UI.Config.Palette();

    config.sbColorPrimary = "#C8193C";
    config.sbColorPrimaryDisabled = "#F5F5F5";
    config.sbColorNegative = "#FF3737";
    config.sbColorPositive = "#4EFFB4";
    config.sbColorWarning = "#FFCE5C";
    config.sbColorSecondary = "#FFEDEE";
    config.sbColorSecondaryDisabled = "#F5F5F5";
    config.sbColorOnPrimary = "#FFFFFF";
    config.sbColorOnSecondary = "#C8193C";
    config.sbColorSurface = "#FFFFFF";
    config.sbColorOutline = "#EFEFEF";
    config.sbColorOnSurfaceVariant = "#707070";
    config.sbColorOnSurface = "#000000";
    config.sbColorSurfaceLow = "#2600000";
    config.sbColorSurfaceHigh = "#7A00000";
    config.sbColorModalOverlay = "#A300000";

    return config;
}
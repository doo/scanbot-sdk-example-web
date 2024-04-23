
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";

export function createMultipleScanningUseCaseConfig() {

    const config = new ScanbotSDK.UI.Config.MultipleScanningMode();

    // Set the counting mode.
    config.mode = "COUNTING";

    // Set the sheet mode for the barcodes preview.
    config.sheet.mode = "COLLAPSED_SHEET";

    // Set the height for the collapsed sheet.
    config.sheet.collapsedVisibleHeight = "LARGE";

    // Enable manual count change.
    config.sheetContent.manualCountChangeEnabled = true;

    // Set the delay before same barcode counting repeat.
    config.countingRepeatDelay = 1000;

    // Configure the submit button
    config.sheetContent.submitButton.text = "Submit";
    config.sheetContent.submitButton.foreground.color = "#000000";

    return config;
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";

export function createSingleScanningUseCaseConfig() {

    const config = new ScanbotSDK.UI.Config.SingleScanningMode();

    config.confirmationSheetEnabled = true;
    config.sheetColor = "#FFFFFF";

    // Hide/unhide the barcode image.
    config.barcodeImageVisible = true;

    // Configure the barcode title of the confirmation sheet.
    config.barcodeTitle.visible = true;
    config.barcodeTitle.color = "#000000";

    // Configure the barcode subtitle of the confirmation sheet.
    config.barcodeSubtitle.visible = true;
    config.barcodeSubtitle.color = "#000000";

    // Configure the cancel button of the confirmation sheet.
    config.cancelButton.text = "Close";
    config.cancelButton.foreground.color = "#C8193C";
    config.cancelButton.background.fillColor = "#00000000";

    // Configure the submit button of the confirmation sheet.
    config.submitButton.text = "Submit";
    config.submitButton.foreground.color = "#FFFFFF";
    config.submitButton.background.fillColor = "#C8193C";

    return config;
}
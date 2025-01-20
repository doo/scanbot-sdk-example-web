
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applySingleScanningUseCase(config: UIConfig.BarcodeScannerScreenConfiguration) {

    const useCase = new ScanbotSDK.UI.Config.SingleScanningMode();

    useCase.confirmationSheetEnabled = true;
    useCase.sheetColor = "#FFFFFF";

    // Hide/unhide the barcode image.
    useCase.barcodeImageVisible = true;

    // Configure the barcode title of the confirmation sheet.
    useCase.barcodeTitle.visible = true;
    useCase.barcodeTitle.color = "#000000";

    // Configure the barcode subtitle of the confirmation sheet.
    useCase.barcodeSubtitle.visible = true;
    useCase.barcodeSubtitle.color = "#000000";

    // Configure the cancel button of the confirmation sheet.
    useCase.cancelButton.text = "Close";
    useCase.cancelButton.foreground.color = "#C8193C";
    useCase.cancelButton.background.fillColor = "#FFFFFF30";

    // Configure the submit button of the confirmation sheet.
    useCase.submitButton.text = "Submit";
    useCase.submitButton.foreground.color = "#FFFFFF";
    useCase.submitButton.background.fillColor = "#C8193C";

    config.useCase = useCase;
}

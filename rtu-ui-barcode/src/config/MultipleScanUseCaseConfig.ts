
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyMultipleScanUseCase(config: UIConfig.BarcodeScannerScreenConfiguration) {

    if (!config) {
        config = new ScanbotSDK.UI.Config.BarcodeScannerScreenConfiguration();
    }

    const useCase = new ScanbotSDK.UI.Config.MultipleScanningMode();

    // Set the counting mode.
    useCase.mode = "COUNTING";

    // Set the sheet mode for the barcodes preview.
    useCase.sheet.mode = "COLLAPSED_SHEET";

    // Set the height for the collapsed sheet.
    useCase.sheet.collapsedVisibleHeight = "LARGE";

    // Enable manual count change.
    useCase.sheetContent.manualCountChangeEnabled = true;

    // Set the delay before same barcode counting repeat.
    useCase.countingRepeatDelay = 1000;

    // Configure the submit button
    useCase.sheetContent.submitButton.text = "Submit";
    useCase.sheetContent.submitButton.foreground.color = "#000000";

    config.useCase = useCase;
}

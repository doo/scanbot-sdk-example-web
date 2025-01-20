
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import { ExpectedBarcode } from "scanbot-web-sdk/@types/ui2/configuration/barcode/FindAndPickScanningModeUseCase";

export function applyFindAndPickConfig(config: UIConfig.BarcodeScannerScreenConfiguration) {

    const useCase = new UIConfig.FindAndPickScanningMode();

    useCase.arOverlay.visible = true;
    useCase.arOverlay.polygon.visible = true;

    // Style completed, rejected and in progress states. In this example we change the stroke color
    useCase.arOverlay.polygon.completed.strokeColor = "green";
    useCase.arOverlay.polygon.rejected.strokeColor = "red";

    // Keep the sheet collapsed and show a button to open it.
    useCase.sheet.mode = 'COLLAPSED_SHEET';
    useCase.sheet.mode = "BUTTON";

    useCase.expectedBarcodes = [
        // This will only recognize barcodes with the value "ScanbotSDK test" and will find 5 instances of it.
        new ExpectedBarcode({ barcodeValue: "ScanbotSDK test", count: 5 }),
    ];

    config.useCase = useCase;
}

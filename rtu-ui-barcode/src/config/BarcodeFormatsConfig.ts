/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk";

export function applyBarcodeFormatsConfig(config: UIConfig.BarcodeScannerScreenConfiguration) {
    config.scannerConfiguration.barcodeFormatConfigurations = [
        new ScanbotSDK.Config.BarcodeFormatQrCodeConfiguration({ microQr: true }),
        new ScanbotSDK.Config.BarcodeFormatPdf417Configuration(),
        new ScanbotSDK.Config.BarcodeFormatUpcEanConfiguration({ upca: true }),
    ];

    // You can also add configurations with different priorities,
    // the first items in the array have the lower priority, the latter items the higher priority.
    // Redundancies will be internally resolved in favor of the higher priority configuration.
    config.scannerConfiguration.barcodeFormatConfigurations = [
        // Lowest priority
        new ScanbotSDK.Config.BarcodeFormatCommonConfiguration({
            formats: ["PDF_417", "CODE_128", "UPC_A"],
            gs1Handling: "PARSE",
            minimum1DQuietZoneSize: 7
        }),
        // Mid-priority
        new ScanbotSDK.Config.BarcodeFormatCommonOneDConfiguration({ formats: ["MICRO_QR_CODE", "QR_CODE", "PDF_417", "UPC_A"] }),
        // Highest priority
        new ScanbotSDK.Config.BarcodeFormatQrCodeConfiguration({ microQr: true, gs1Handling: "DECODE_STRUCTURE" }),
        // Highest priority, will overwrite gs1Handling for pdf417 from common
        new ScanbotSDK.Config.BarcodeFormatPdf417Configuration({ gs1Handling: "DECODE_STRUCTURE" }),
        // Highest priority, will overwrite minimum1DQuietZoneSize for upca
        new ScanbotSDK.Config.BarcodeFormatUpcEanConfiguration({
            upca: true,
            minimum1DQuietZoneSize: 43,
            extensions: "ALLOW_5"
        }),
    ];
}

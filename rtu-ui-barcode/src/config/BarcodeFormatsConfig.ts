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
            formats: ["PDF_417", "DATA_MATRIX", "CODE_39", "CODE_128", "UPC_A"],
            gs1Handling: "PARSE",
            minimum1DQuietZoneSize: 7
        }),
        // Mid-priority, only applied to one-d barcode formats, overwrites minimum1DQuietZoneSize for CODE_39 from common config
        new ScanbotSDK.Config.BarcodeFormatCommonOneDConfiguration({
            formats: ["CODE_39", "CODE_93"],
            minimum1DQuietZoneSize: 9
        }),
        // Mid-priority, only applied to twod barcode formats, overwrites gs1Handling for DATA_MATRIX from common config
        new ScanbotSDK.Config.BarcodeFormatCommonTwoDConfiguration({
            formats: ["DATA_MATRIX", "AZTEC"],
            gs1Handling: "VALIDATE_STRUCTURE"
        }),
        // Highest priority
        new ScanbotSDK.Config.BarcodeFormatQrCodeConfiguration({ microQr: true, gs1Handling: "DECODE_STRUCTURE" }),
        // Highest priority, overwrites gs1Handling for pdf417 from common
        new ScanbotSDK.Config.BarcodeFormatPdf417Configuration({ gs1Handling: "DECODE_STRUCTURE" }),
        // Highest priority, overwrites minimum1DQuietZoneSize for code93 from common oned
        new ScanbotSDK.Config.BarcodeFormatCode93Configuration({ minimum1DQuietZoneSize: 12 }),
        // Highest priority, overwrites minimum1DQuietZoneSize for upca from common
        new ScanbotSDK.Config.BarcodeFormatUpcEanConfiguration({
            upca: true,
            minimum1DQuietZoneSize: 11,
            extensions: "ALLOW_5"
        }),
    ];
}

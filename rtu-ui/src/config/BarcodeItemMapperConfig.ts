
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { BarcodeMappedData, BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/ui2/configuration";

export function applyBarcodeItemMapperConfig(config: BarcodeScannerConfiguration) {

    config.useCase.barcodeInfoMapping.barcodeItemMapper = (): Promise<BarcodeMappedData> => {
        return new Promise((resolve) => {
            resolve({
                title: "Title",
                subtitle: "Subtitle",
                barcodeImage: "https://placehold.co/68"
            })
        });
    }
}
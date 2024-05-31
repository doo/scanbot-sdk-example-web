
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { BarcodeItem, BarcodeMappedData, BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/ui2/configuration";

export function applyBarcodeItemMapperConfig(config: BarcodeScannerConfiguration) {

    config.useCase.barcodeInfoMapping.barcodeItemMapper = (barcode: BarcodeItem): Promise<BarcodeMappedData> => {
        return new Promise((resolve) => {
            resolve({
                /** 
                 * TODO: process scan result as needed to get your mapped data,
                 * e.g. query your server to get product image, title and subtitle.
                 */
                title: `Some product ${barcode.text}`,
                subtitle: barcode.type,
                barcodeImage: "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            })
        });
    }
}
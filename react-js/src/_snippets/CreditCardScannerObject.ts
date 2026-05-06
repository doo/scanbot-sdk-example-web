/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { CreditCardScanningResult, CreditCardScannerViewConfiguration } from "scanbot-web-sdk/@types";

export class CreditCardScannerObject {

    async create() {

        const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: './wasm/' });

        const config: CreditCardScannerViewConfiguration = {
            containerId: "<SCANNER-CONTAINER-ID>",
            onCreditCardDetected: (result: CreditCardScanningResult) => {
                console.log("Credit card has been detected, process result:", result);
            },
        };
        const scanner = await sdk.createCreditCardScanner(config);
        scanner.dispose();

        // Advanced Configuration. In reality, you would want to configure the scanner before creating it,
        // but for the convenience of separating documentation snippets, it makes sense to do it after.
        if (!config.scannerConfiguration) {
            return;
        }
        config.scannerConfiguration.processingMode = "LIVE";
        config.scannerConfiguration.requireExpiryDate = true;
        config.scannerConfiguration.requireCardholderName = false;
    }
}

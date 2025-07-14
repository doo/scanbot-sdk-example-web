/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { CheckScannerViewConfiguration, CheckScanningResult } from "scanbot-web-sdk/@types";

export class CheckScannerObject {

    async create() {

        const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: './wasm/' });

        const config: CheckScannerViewConfiguration = {
            containerId: "<SCANNER-CONTAINER-ID>",
            onCheckDetected: (result: CheckScanningResult) => {
                console.log("Check has been detected, process result:", result);
            },
        };
        const scanner = await sdk.createCheckScanner(config);
        scanner.dispose();

        // Advanced Configuration. In reality, you would want to configure the scanner before creating it,
        // but for the convenience of separating documentation snippets, it makes sense to do it after.
        if (!config.scannerConfiguration) {
            return;
        }
        config.scannerConfiguration.documentDetectionMode = "DETECT_DOCUMENT";
        config.scannerConfiguration.processingMode = "LIVE";
    }
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { DocumentDataExtractorViewConfiguration } from "scanbot-web-sdk/@types";

export class DocumentDataExtractObject {

    async create() {

        const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: './wasm/' });

        const config: DocumentDataExtractorViewConfiguration = {
            containerId: "<SCANNER-CONTAINER-ID>",
            onDocumentDetected: (response) => {
                console.log("Document has been detected, process response:", response);
            },
        };
        const scanner = await sdk.createDocumentDataExtractor(config);
        scanner.dispose();

        // Advanced Configuration. In reality, you would want to configure the scanner before creating it,
        // but for the convenience of separating documentation snippets, it makes sense to do it after.
        if (!config.detectorParameters) {
            return;
        }
        config.detectorParameters.documentTrustMode = "TRUSTED";
        config.detectorParameters.processingMode = "LIVE";
    }
}

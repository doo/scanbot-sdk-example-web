/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";
import { Config, SBDocument } from "scanbot-web-sdk/@types";

// Mock the initialization of ScanbotSDK for the example.
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function analyzeDocumentQuality(document: SBDocument) {
    const config = new Config.DocumentQualityAnalyzerConfiguration();
    const analyzer = await sdk.createDocumentQualityAnalyzer(config);

    for (const page of document.pages) {
        let image = await page.loadDocumentImage();

        if (image === null) {
            // If a document image does not exist, load the original image.
            // Though, ideally, you wouldn't want to analyze the original image,
            image = await page.loadOriginalImage();
        }
        const response = await analyzer.run(image);
        console.log("Document Quality Analysis Result for page:", response.result.quality);
    }
}

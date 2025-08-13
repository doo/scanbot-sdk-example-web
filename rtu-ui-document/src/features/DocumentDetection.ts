/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { DocumentScannerUIResult } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

// Mock the initialization of ScanbotSDK for the example.
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function detectOnDocument(result: DocumentScannerUIResult) {
    for (const page of result!.document.pages) {
        // Load original image
        const image = await page.loadOriginalImage();
        // Run document detection on the retrieved image.
        const response = await sdk.detectDocument(image);
        const detectionResult = response.detectionResult;
        // Check the result and retrieve the detected polygon.
        if (detectionResult.status === "OK" && detectionResult.pointsNormalized?.length !== 0) {
            document.apply(page, { polygon: detectionResult.pointsNormalized });
        }
    }
}

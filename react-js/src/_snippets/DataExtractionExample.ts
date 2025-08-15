/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

// Mock the ScanbotSDK initialization for this snippet
import ScanbotSDK from "scanbot-web-sdk/ui";

const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export default class DataExtractionExample {

    static async extractFromDocument(data: ArrayBuffer | Uint8Array) {
        const config = new ScanbotSDK.Config.DocumentDataExtractorConfiguration();
        const engine = await sdk.createDocumentDataExtractorEngine(config);
        // Convert uploaded file to a Scanbot Image
        const image = ScanbotSDK.Config.Image.fromEncodedBinaryData(data);
        const response = await engine.run(image);
        console.log("Document Data Extraction Result:", response.result.document);
    }

    static async extractFromCheck(data: ArrayBuffer | Uint8Array) {
        const config = new ScanbotSDK.Config.CheckScannerConfiguration();
        const engine = await sdk.createCheckScannerEngine(config);
        // Convert uploaded file to a Scanbot Image
        const image = ScanbotSDK.Config.Image.fromEncodedBinaryData(data);
        const response = await engine.run(image);
        console.log("Check Detection Result:", response.result.check);
    }
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import ImageUtils, { MimeType } from "../service/ImageUtils";

// Initialize SDK at module level
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: './wasm/' });

export class ImageEnhancer {

    static async straightenImage() {
        // Pick an image file using existing utility function
        const imageData = await ImageUtils.pick(MimeType.Jpeg);
        const originalImage = ScanbotSDK.Config.Image.fromEncodedBinaryData(imageData.buffer);

        // Create straightening parameters
        const parameters = new ScanbotSDK.Config.DocumentStraighteningParameters({
            straighteningMode: "STRAIGHTEN"
        });

        // Create a document enhancer instance
        const enhancer = await sdk.API.DocumentEnhancer.create();

        // Apply straightening to the image using Document Enhancer API
        const response = await enhancer.straighten(originalImage, parameters);

        console.log("Original image:", originalImage);
        console.log("Straightened image:", response.result.straightenedImage);
    }

    static async startRTUUIScanner() {
        const config = new ScanbotSDK.UI.Config.DocumentScanningFlow();

        // Pre-configure straightening parameters for the RTUUI Document Scanner
        const parameters = new ScanbotSDK.Config.DocumentStraighteningParameters();
        parameters.straighteningMode = "STRAIGHTEN";
        config.outputSettings.straighteningParameters = parameters;
        config.outputSettings.straighteningParameters.aspectRatios = [
            new ScanbotSDK.Config.AspectRatio({ width: 1, height: 1 }),
            new ScanbotSDK.Config.AspectRatio({ width: 16, height: 9 }),
            new ScanbotSDK.Config.AspectRatio({ width: 3, height: 4 })
        ];
        const result = await ScanbotSDK.UI.createDocumentScanner(config);
        console.log("Scanned document with straightening applied:", result?.document);
    }

    static async straightenScannedPage() {
        const result = await ScanbotSDK.UI.createDocumentScanner(new ScanbotSDK.UI.Config.DocumentScanningFlow());
        // Straighten individual pages after scanning, using Document Enhancer API
        const parameters = new ScanbotSDK.Config.DocumentStraighteningParameters({ straighteningMode: "STRAIGHTEN" });
        const page = result!.document.pages[0];
        result?.document.straightenPage(page, parameters);
    }
}

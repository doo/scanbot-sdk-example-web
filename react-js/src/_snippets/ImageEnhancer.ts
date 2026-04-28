/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { DocumentStraighteningParameters } from "scanbot-web-sdk/@types";
import ImageUtils, { MimeType } from "../service/ImageUtils";

// Initialize SDK at module level
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: './wasm/' });

export class ImageEnhancer {

    static async straighten() {
        // Pick an image file using existing utility function
        const imageData = await ImageUtils.pick(MimeType.Jpeg);
        const originalImage = ScanbotSDK.Config.Image.fromEncodedBinaryData(imageData.buffer);

        // Create straightening parameters
        const parameters = new DocumentStraighteningParameters({
            straighteningMode: "STRAIGHTEN"
        });

        // Create a document enhancer instance
        const enhancer = await sdk.API.DocumentEnhancer.create();

        // Apply straightening to the image using Document Enhancer API
        const response = await enhancer.straighten(originalImage, parameters);

        console.log("Original image:", originalImage);
        console.log("Straightened image:", response.result.straightenedImage);
    }
}

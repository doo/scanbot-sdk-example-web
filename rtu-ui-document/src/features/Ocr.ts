/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { OcrEngineRunResponse, SBDocument } from "scanbot-web-sdk/@types";


// Mock the initialization of ScanbotSDK for the example.
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function runOcrOnImage(image: ArrayBuffer | Uint8Array) {
    // Create the engine
    const engine = await sdk.createOcrEngine();
    // Convert data to ScanbotSDK Image format & run OCR on the provided image data
    const response = await engine.run(ScanbotSDK.Config.Image.fromEncodedBinaryData(image))
    processOcrResponse(response);
}

export async function runOcrOnDocument(document: SBDocument) {
    // Create the engine
    const engine = await sdk.createOcrEngine();

    for (const page of document.pages) {
        const image = await page.loadDocumentImage();

        if (image) {
            // Run OCR on the document image
            const response = await engine.run(image);
            processOcrResponse(response);
        }
    }
}

export function processOcrResponse(response: OcrEngineRunResponse) {
    const result = response.result;
    // Recognized plain text
    const text = result.text;

    // Bounding boxes and text results of recognized paragraphs, lines and words (as example for the first page):
    const firstBlock = result.blocks[0];
    const linesInFirstBlock = firstBlock.lines
    const wordsInFirstLine = firstBlock.lines[0].words
}

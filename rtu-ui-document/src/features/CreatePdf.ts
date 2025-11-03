/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { SBDocument } from "scanbot-web-sdk/@types";

const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function createPdfWithOcrFromDocument(document: SBDocument) {
    const config = new ScanbotSDK.Config.PdfConfiguration();
    const engine = await sdk.beginPdf(config);
    await engine.addPages(document, true);
    // Download or upload the buffer as a PDF file
    const pdf = await engine.complete();
}

export async function createPdfWithOcrFromBuffer(buffer: ArrayBuffer | Uint8Array) {
    const config = new ScanbotSDK.Config.PdfConfiguration();
    const engine = await sdk.beginPdf(config);
    const image = ScanbotSDK.Config.Image.fromEncodedBinaryData(buffer);
    await engine.addPage(image, { runOcr: true });
    // Download or upload the buffer as a PDF file
    const pdf = await engine.complete();
}

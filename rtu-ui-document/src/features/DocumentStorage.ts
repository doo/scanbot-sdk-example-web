import ScanbotSDK from "scanbot-web-sdk/ui";
import { Image, SBDocument } from "scanbot-web-sdk/@types";

export async function retrieveDocumentFromStorage(documentId: number): Promise<SBDocument> {
    return await ScanbotSDK.UI.SBDocument.loadFromStorage(documentId);
}

export async function loadPageImages(document: SBDocument, pageId: number): Promise<Image[]> {
    const page = document.pages.find(page => page.id === pageId);
    if (!page) {
        throw new Error(`Page with id ${pageId} not found in document.`);
    }
    const list = [await page.loadOriginalImage()];

    if (page.getData().documentImageId !== null) {
        // If document image id exists, its corresponding image also exists in storage and we can load it to memory
        const documentImage = await page.loadDocumentImage() as Image;
        list.push(documentImage);
    }
    return list;
}

export async function reorderPages(document: SBDocument): Promise<void> {
    const sourceIndex = document.pages.length - 1;
    const targetIndex = 0;
    // Moves the last page to the first position
    await document.movePage(sourceIndex, targetIndex);
}

export async function deletePages(document: SBDocument): Promise<void> {
    // Clears all pages from the document
    await document.deleteAllPages();
}

export async function deleteDocument(document: SBDocument): Promise<void> {
    // Deletes the document and all its pages
    await document.delete();
}

export async function createAndLoadPdf(document: SBDocument): Promise<Image> {
    // Creates a PDF from the document, this function also automatically saves the PDF to persistent storage
    const options = {};
    const buffer = await document.createPdf(options);
    // You can use the buffer directly or load the rendered PDF from storage later
    console.log("PDF created with size:", buffer.byteLength);
    return await document.loadPdf();
}

export async function deletePdf(document: SBDocument): Promise<boolean> {
    const pdfId = document.getData().pdfId;
    if (pdfId === null) {
        // The pdf hasn't been created for this document
        return false;
    }
    return await document.deletePdf();
}

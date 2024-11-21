import { Box } from "@mui/material";
import NavigationBar from "../subviews/NavigationBar";
import { DocumentScannerUIResult, SBDocument, SBDocumentData } from "scanbot-web-sdk/@types";
import { useEffect, useState } from "react";
import ScanbotSDK from "scanbot-web-sdk/ui";

export default function DocumentResultPage() {
    const [documentIds, setDocumentIds] = useState<number[] | null>(null);

    useEffect(() => {
        (async () => {
            const ids = await ScanbotSDK.instance.storage.getSBDocumentIds();
            setDocumentIds(ids);
        })();
    }, []);

    if (documentIds === null) {
        return <p>"Loading..."</p>;
    }

    if (documentIds.length === 0) {
        return <p>"No documents in storage."</p>;
    }

    return <>
        {documentIds.map((documentId) => <DocumentEntry key={documentId} documentId={documentId} />)}
    </>;
}

function DocumentEntry(props: { documentId: number }) {
    const [document, setDocument] = useState<SBDocumentData | null>(null);
    const [pagesImageUrls, setPagesImageUrls] = useState<string[]>([]);
    useEffect(() => {
        (async () => {
            const doc = await ScanbotSDK.instance.storage.getSBDocument(props.documentId);
            setDocument(doc);

            const urls: Promise<string>[] = [];
            for (const page of doc.pages) {
                urls.push(await page.finalImageUrl());
            }
        })();
    }, []);

    async function saveAsPdf() {
        if (!props.documentScanResult || !ScanbotSDK.instance) {
            return;
        }
        const pdf = await ScanbotSDK.instance.beginPdf({});
        await pdf.addPages(props.documentScanResult.document);
        const pdfData = await pdf.complete();
        const dataUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'scanbot-sdk-document.pdf';
        a.click();
        URL.revokeObjectURL(dataUrl);
    }

    return (
        <Box sx={{ width: '100%', height: "100%", bgcolor: 'background.paper' }}>
            <NavigationBar isBackButtonVisible={true} />
            {!props.documentScanResult && "No document scan result available yet."}
            {props.documentScanResult && <>
                <h2>Output file generation:</h2>
                <p>
                    <button onClick={saveAsPdf}>Save as PDF</button>
                </p>
                <h2>Pages: </h2>
                <ul>
                    {pagesImageUrls.map((imageUrl, index) => <>
                        <li key={index}>
                            <img src={imageUrl} alt={`Page ${index + 1}`} />
                        </li>
                    </>)}
                </ul>
            </>}
        </Box>
    );
}
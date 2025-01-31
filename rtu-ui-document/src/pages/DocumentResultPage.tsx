import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ScanbotSDK from "scanbot-web-sdk/ui";
import { SBDocument } from "scanbot-web-sdk/@types";
import NavigationBar from "../subviews/NavigationBar";



export default function DocumentResultPage() {
    const [documentIds, setDocumentIds] = useState<number[] | null>(null);

    useEffect(() => {
        (async () => {
            const ids = await ScanbotSDK.instance.storage.getSBDocumentIds();
            setDocumentIds(ids);
        })();
    }, []);

    return <>
        <Box sx={{ width: '100%', height: "100%", bgcolor: 'background.paper' }}>
            <NavigationBar isBackButtonVisible={true} />
            {documentIds === null && <p>Loading...</p>}
            {documentIds?.length === 0 && <p>No documents in storage.</p>}
            {documentIds?.map((documentId) =>
                <DocumentEntry
                    key={documentId}
                    documentId={documentId}
                    onAfterDelete={() => {
                        setDocumentIds((prev) => prev?.filter((id) => id !== documentId) || []);
                    }}
                />
            )}
        </Box>
    </>;
}

function DocumentEntry(props: { documentId: number, onAfterDelete: () => void }) {
    const [document, setDocument] = useState<SBDocument | null>(null);
    const [pagesImageUrls, setPagesImageUrls] = useState<string[]>([]);
    useEffect(() => {
        (async () => {
            const doc = await ScanbotSDK.UI.SBDocument.loadFromStorage(props.documentId);
            setDocument(doc);

            const urls: string[] = [];
            for (const page of doc.pages) {
                const documentImageId = page.getData().documentImageId;
                if (documentImageId !== null) {
                    const image = await ScanbotSDK.instance.storage.getSBPageImage(documentImageId);
                    const url = await ScanbotSDK.instance.toDataUrl(
                        await ScanbotSDK.instance.imageToJpeg(image)
                    );
                    urls.push(url);
                }
            }
            setPagesImageUrls(urls);
        })();
    }, [props.documentId]);

    async function saveAsPdf() {
        if (!document || !ScanbotSDK.instance) {
            return;
        }
        const pdf = await ScanbotSDK.instance.beginPdf({});
        await pdf.addPages(document);
        const pdfData = await pdf.complete();
        const dataUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
        const a = window.document.createElement('a');
        a.href = dataUrl;
        a.download = 'scanbot-sdk-document.pdf';
        a.click();
        URL.revokeObjectURL(dataUrl);
    }

    return (
        <Box sx={{ width: '100%', height: "100%", bgcolor: 'background.paper' }}>
            {!document && "No document scan result available yet."}
            {document && <>
                <p style={{marginTop: 40}}>
                    <h4 style={{ display: "inline", margin: 10 }}>Document {document.data.id}</h4>
                    <button onClick={saveAsPdf}>Save as PDF</button>
                    <button onClick={async () => {
                        await document.delete();
                        props.onAfterDelete();
                    }}>
                        Delete
                    </button>
                </p>
                <h5 style={{margin:10}}>{document.pages.length} pages: </h5>
                <p>
                    {pagesImageUrls.map((imageUrl, index) => <>
                        <img key={index} style={{ maxWidth: 50, margin: 10 }} src={imageUrl} alt={`Page ${index + 1}`} />
                    </>)}
                </p>
            </>}
        </Box>
    );
}

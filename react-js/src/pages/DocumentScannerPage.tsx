import { useRef, useEffect } from "react";
import {
    CroppedDetectionResult,
    DocumentScannerViewConfiguration,
    IDocumentScannerHandle
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService.ts";
import SBSDKPage from "../subviews/SBSDKPage.tsx";

export default function DocumentScannerPage() {

    const handle = useRef<IDocumentScannerHandle | null>(null);

    const onDocumentDetected = async (result: CroppedDetectionResult) => {

        // Flash the screen to indicate that a document was detected
        SBSDKService.SDK.utils.flash();
        console.log("Detected document: ", result);
        await SBSDKService.SDK.storage.storeCroppedDetectionResult(result);

        if (result.croppedImage) {
            // If a cropped image is available, it means a document was detected and we can analyze the quality of it.
            const analyzer = await SBSDKService.SDK.createDocumentQualityAnalyzer({});
            const analysis = await analyzer.analyze(result.croppedImage);
            console.log("Document quality analysis: ", analysis);
        }
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: DocumentScannerViewConfiguration = {
                containerId: ContainerId.DocumentScanner,
                onDocumentDetected: onDocumentDetected,
            };
            handle.current = await SBSDKService.SDK.createDocumentScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Document Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage title={"Document Scanner"} containerId={ContainerId.DocumentScanner} />
}

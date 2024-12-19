import { useRef, useEffect } from "react";
import {
    CroppedDetectionResult,
    DocumentScannerViewConfiguration,
    IDocumentScannerHandle
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService.tsx";
import SBSDKPage from "./subviews/SBSDKPage.tsx";

export default function DocumentScannerPage() {

    const handle = useRef<IDocumentScannerHandle | null>(null);

    const onDocumentDetected = (result: CroppedDetectionResult) => {
        console.log("Detected document: ", result);
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

import React, { useRef, useEffect } from "react";
import {
    DocumentDataExtractionResult,
    DocumentDataExtractorViewConfiguration,
    IDocumentDataExtractorHandle,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";
import ScanbotSDK from "scanbot-web-sdk/ui";

export default function DocumentDataExtractorPage() {

    const handle = useRef<IDocumentDataExtractorHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onDocumentDetected = async (result: DocumentDataExtractionResult) => {
        if (result.documentDetectionResult.status == 'NOT_ACQUIRED') return;
        console.log("DDE result:", result);
        let text = "Document detected:" + result.documentDetectionResult.status;
        setToast(text);
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: DocumentDataExtractorViewConfiguration = {
                containerId: ContainerId.DocumentDataExtractor,
                onDocumentDetected: onDocumentDetected,
                scannerConfiguration: {
                    configurations: [
                        new ScanbotSDK.Config.DocumentDataExtractorCommonConfiguration()
                    ]
                }
            };
            handle.current = await SBSDKService.SDK.createDocumentDataExtractor(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Document Data Extractor is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        };
    }, []);

    return <><SBSDKPage title={"Document Data Extractor"} containerId={ContainerId.DocumentDataExtractor}
                        toast={{ text: toast }} /><div id="result"></div></>;
}

import { useRef, useEffect } from "react";
import { Box } from "@mui/material";
import { CroppedDetectionResult, DocumentScannerViewConfiguration, IDocumentScannerHandle } from "scanbot-web-sdk/@types";

import { TopBarHeight, TopBar } from "../subviews/TopBar.tsx";
import SBSDKService, { ContainerId } from "../service/SBSDKService.tsx";

export default function DocumentScannerPage() {

    const handle = useRef<IDocumentScannerHandle | null>(null);

    const onDocumentDetected = (document: CroppedDetectionResult) => {
        console.log("Detected document: ", document);
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
            handle.current?.dispose();
        }
    }, []);

    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"Document Scanner"} isBackNavigationEnabled={true} />
            <div id={ContainerId.DocumentScanner} style={{ width: "100%", height: `calc(100% - ${TopBarHeight}px)` }} />
        </Box>
    )
}

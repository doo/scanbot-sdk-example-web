import { useRef, useEffect } from "react";
import {
    ITextPatternScannerHandle,
    TextPatternScannerResult,
    TextPatternScannerViewConfiguration,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService.tsx";
import SBSDKPage from "../subviews/SBSDKPage.tsx";

export default function TextPatternScannerPage() {

    const handle = useRef<ITextPatternScannerHandle | null>(null);

    const onTextDetected = (result: TextPatternScannerResult) => {
        console.log("Detected Text: ", result);
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: TextPatternScannerViewConfiguration = {
                containerId: ContainerId.TextPatternScanner,
                onTextDetected: onTextDetected,
            };
            handle.current = await SBSDKService.SDK.createTextPatternScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Text Pattern Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage title={"Text pattern Scanner"} containerId={ContainerId.TextPatternScanner} />
}

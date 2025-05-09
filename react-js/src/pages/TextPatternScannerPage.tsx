import React, { useRef, useEffect } from "react";
import {
    ITextPatternScannerHandle,
    TextPatternScannerResult,
    TextPatternScannerViewConfiguration,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function TextPatternScannerPage() {

    const handle = useRef<ITextPatternScannerHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onTextDetected = (result: TextPatternScannerResult) => {
        if (result.rawText === "") {
            // Pointless to show empty text
            return;
        }
        setToast(JSON.stringify(result.rawText));
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: TextPatternScannerViewConfiguration = {
                containerId: ContainerId.TextPatternScanner,
                onTextDetected: onTextDetected,
                ocrConfiguration: {
                    validator: {
                        // Be sure to specify the type of the validator when using JSON instantiation.
                        _type: "PatternContentValidator",
                        // Any pattern you want to match, also supports regex. Left empty since we want to match everything.
                        pattern: "",
                    }
                    // Alternatively, you can create the following object using the constructor:
                    // new ScanbotSDK.Config.PatternContentValidator({ pattern: "" })
                }
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

    return <SBSDKPage title={"Text pattern Scanner"} containerId={ContainerId.TextPatternScanner} toast={toast} />
}

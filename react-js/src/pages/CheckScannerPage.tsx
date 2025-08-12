import React, { useRef, useEffect } from "react";
import {
    CheckScanningResult,
    CheckScannerViewConfiguration,
    ICheckScannerHandle,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function CheckScannerPage() {

    const handle = useRef<ICheckScannerHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onCheckDetected = (result: CheckScanningResult) => {
        console.log("Check detected:", result);
        let text = "Type: " + result.check?.type.name + "\n";
        result.check?.fields.forEach((field) => {
            text += `Field '${field.type.commonType}': ${field.value?.text}\n`;
        })
        setToast(text);
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: CheckScannerViewConfiguration = {
                containerId: ContainerId.CheckScanner,
                onCheckDetected: onCheckDetected,
                scannerConfiguration: {
                    processingMode: 'LIVE',
                    documentDetectionMode: 'DETECT_AND_CROP_DOCUMENT',
                }
            };
            handle.current = await SBSDKService.SDK.createCheckScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Check Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage title={"Check Scanner"} containerId={ContainerId.CheckScanner} toast={{ text: toast }} />
}

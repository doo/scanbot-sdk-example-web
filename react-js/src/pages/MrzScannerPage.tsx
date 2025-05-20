import React, { useRef, useEffect } from "react";
import { IMrzScannerHandle, MrzScannerResult, MrzScannerViewConfiguration, } from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function MRZScannerPage() {

    const handle = useRef<IMrzScannerHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onMrzDetected = (result: MrzScannerResult) => {
        setToast(JSON.stringify(result));
    };

    useEffect(() => {

        async function load() {
            const element = document.getElementById(ContainerId.MrzScanner) as HTMLElement;
            await SBSDKService.initialize();
            const config: MrzScannerViewConfiguration = {
                container: element,
                onMrzDetected: onMrzDetected,
            };
            handle.current = await SBSDKService.SDK.createMrzScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK MRZ Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage title={"MRZ Scanner"} containerId={ContainerId.MrzScanner}
                      toast={{ text: toast, color: "GREEN" }} />
}

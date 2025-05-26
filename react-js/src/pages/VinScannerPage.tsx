import React, { useRef, useEffect } from "react";
import { ITextPatternScannerHandle, VinScannerResult, VinScannerViewConfiguration, } from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function VINScannerPage() {

    const handle = useRef<ITextPatternScannerHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onTextDetected = (result: VinScannerResult) => {
        setToast(JSON.stringify(result));
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: VinScannerViewConfiguration = {
                containerId: ContainerId.VinScanner,
                onVinDetected: onTextDetected,
            };
            handle.current = await SBSDKService.SDK.createVinScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK VIN Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage
        title={"VIN Scanner"}
        containerId={ContainerId.VinScanner}
        toast={{ text: toast, color: "GREEN" }}
    />
}

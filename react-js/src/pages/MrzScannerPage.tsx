import { useRef, useEffect } from "react";
import { IMrzScannerHandle, MrzScannerResult, MrzScannerViewConfiguration, } from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService.tsx";
import SBSDKPage from "../subviews/SBSDKPage.tsx";

export default function MRZScannerPage() {

    const handle = useRef<IMrzScannerHandle | null>(null);

    const onMrzDetected = (result: MrzScannerResult) => {
        console.log("Detected MRZ: ", result);
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: MrzScannerViewConfiguration = {
                containerId: ContainerId.MrzScanner,
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

    return <SBSDKPage title={"MRZ Scanner"} containerId={ContainerId.MrzScanner} />
}

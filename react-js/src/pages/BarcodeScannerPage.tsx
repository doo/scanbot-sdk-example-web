import { useRef, useEffect } from "react";
import {
    BarcodeScannerResultWithSize,
    BarcodeScannerViewConfiguration,
    IBarcodeScannerHandle,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function BarcodeScannerPage() {

    const handle = useRef<IBarcodeScannerHandle | null>(null);

    const onBarcodesDetected = (result: BarcodeScannerResultWithSize) => {
        console.log("Detected barcodes: ", result);
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: BarcodeScannerViewConfiguration = {
                containerId: ContainerId.BarcodeScanner,
                onBarcodesDetected: onBarcodesDetected,
                detectionParameters: {
                    returnBarcodeImage: true,
                }
            };
            handle.current = await SBSDKService.SDK.createBarcodeScanner(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Barcode Scanner is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        }
    }, []);

    return <SBSDKPage title={"Barcode Scanner"} containerId={ContainerId.BarcodeScanner} />
}

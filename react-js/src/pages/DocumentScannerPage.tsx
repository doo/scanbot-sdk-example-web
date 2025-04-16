import { useRef, useEffect } from "react";
import {
    CroppedDetectionResult,
    DocumentScannerViewConfiguration,
    IDocumentScannerHandle, Point
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";

export default function DocumentScannerPage() {

    const handle = useRef<IDocumentScannerHandle | null>(null);

    const onDocumentDetected = async (result: CroppedDetectionResult) => {

        // Flash the screen to indicate that a document was detected
        SBSDKService.SDK.utils.flash();
        console.log("Detected document: ", result);
        await SBSDKService.SDK.storage.storeCroppedDetectionResult(result);

        if (result.croppedImage) {
            // If a cropped image is available, it means a document was detected and we can analyze the quality of it.
            const analyzer = await SBSDKService.SDK.createDocumentQualityAnalyzer({});
            const analysis = await analyzer.analyze(result.croppedImage);
            console.log("Document quality analysis: ", analysis);


            // Rotate the image 360 degrees clockwise, just for the hell of it
            let rotated = await SBSDKService.SDK.imageRotate(result.croppedImage, "CLOCKWISE_180");
            rotated = await SBSDKService.SDK.imageRotate(rotated, "CLOCKWISE_180");

            // Crop the image to be 60% of the original size, by normalized polygon coordinates
            const min = 0.2;
            const max = 0.8;
            const polygon: Point[] = [{ x: min, y: min }, { x: max, y: min }, { x: max, y: max }, { x: min, y: max }];
            const cropped = await SBSDKService.SDK.imageCrop(rotated, polygon);

            // Scanbot SDK functions return raw pixel data. Images should be encoded it as jpegs before saving or displaying them.
            const jpeg = await SBSDKService.SDK.imageToJpeg(cropped);
            console.log("Done processing image: ", jpeg);

            const engine = await SBSDKService.SDK.createOcrEngine();
            const ocrResult = await engine.performOcr(cropped);
            console.log("OCR result: ", ocrResult);
            // Be sure to free up the memory used by the OCR engine
            await engine.release();
        }
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();
            const config: DocumentScannerViewConfiguration = {
                containerId: ContainerId.DocumentScanner,
                onDocumentDetected: onDocumentDetected,
                detectionParameters: {
                    ignoreOrientationMismatch: true
                }
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

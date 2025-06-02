import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import { Image, SBStoreCroppedDetectionResult } from "scanbot-web-sdk/@types";

import SBSDKService from "../service/SBSDKService";
import ImageUtils from "../service/ImageUtils";
import { TopBar } from "../subviews/TopBar";
import { TextColor } from "../subviews/FeatureListItem.tsx";
import { Toast } from "../subviews/Toast.tsx";

export default function StorageDetailsPage() {

    const [item, setItem] = useState<SBStoreCroppedDetectionResult | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [rotatedImage, setRotatedImage] = useState<Image | undefined>(undefined);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    useEffect(() => {

        const search = location.href.split("?")[1];
        if (!search) {
            // TODO handle if missing
        }


        const itemId = parseInt(search.split("=")[1]);
        if (!itemId) {
            // TODO handle if missing
        }

        async function loadItem() {
            setIsLoading(true);
            const sdk = await SBSDKService.awaitSDK();
            const result = await sdk.storage.getCroppedDetectionResult(itemId);
            setItem(result);
            const base64 = await ImageUtils.createBase64Image(result);
            setBase64Image(base64);
            setIsLoading(false);
        }

        loadItem();
    }, []);

    async function runDQA() {
        if (!item) {
            return;
        }
        setIsLoading(true);
        const image = item.croppedImage ?? item.originalImage;
        const analyzer = await SBSDKService.SDK.createDocumentQualityAnalyzer({})
        const result = await analyzer.analyze(image);
        setIsLoading(false);
        setToast("Quality: " + JSON.stringify(result.quality));
    }

    async function runOCR() {
        if (!item) {
            return;
        }

        setIsLoading(true);
        const image = item.croppedImage ?? item.originalImage;
        const engine = await SBSDKService.SDK.createOcrEngine()
        const result = await engine.performOcr(image);
        setIsLoading(false);
        setToast(JSON.stringify(result.text));
    }

    async function rotateImage() {
        if (!item) {
            return;
        }

        setIsLoading(true);
        const image = rotatedImage ?? item.croppedImage ?? item.originalImage;
        const rotated = await SBSDKService.SDK.imageRotate(image, "CLOCKWISE_90");
        setRotatedImage(rotated);

        const base64 = await ImageUtils.rawImageToBase64(rotated);
        setBase64Image(base64);
        setIsLoading(false);
    }

    return (
        <Box style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            backgroundColor: "white"
        }}>
            <TopBar title={"Document Details"} isBackNavigationEnabled={true} />
            <h2 style={{ color: TextColor }}>Storage Details | Item ID: {item?.id}</h2>
            {base64Image && <Box style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                height: "100%",
            }}>
                <img src={base64Image}
                     alt={`Storage image ${item?.id}`}
                     style={{ width: "90%", maxHeight: 500, objectFit: "contain" }}
                />
                <Box style={{ paddingLeft: "5%", paddingTop: 10 }}>
                    <Button onClick={runDQA}>Run Document Quality Analysis</Button>
                    <Button onClick={runOCR}>Run Optical Character Recognition</Button>
                    <Button onClick={rotateImage}>Rotate Image</Button>
                </Box>
            </Box>}
            <CircularProgress
                style={{ position: "absolute", top: "40%", visibility: isLoading ? "visible" : "hidden" }}
                color="primary"
            />

            <Toast text={toast} />
        </Box>
    )
}

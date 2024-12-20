import { useEffect, useState } from "react";
import { Box, ImageList } from "@mui/material";
import { SBStoreCroppedDetectionResult } from "scanbot-web-sdk/@types";

import SBSDKService from "../service/SBSDKService";
import { TopBar } from "../subviews/TopBar.tsx";
import DetectionResultImage from "../subviews/DetectionResultImage.tsx";

export default function StoredDataPage() {

    const [detectionResults, setDetectionResults] = useState<SBStoreCroppedDetectionResult[]>([]);

    useEffect(() => {

        async function loadStorageData() {
            const result = await SBSDKService.SDK.storage.getCroppedDetectionResults(false);
            setDetectionResults(result);
        }

        loadStorageData()
    }, []);

    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"Stored Data"} isBackNavigationEnabled={true} />
            <ImageList cols={3} rowHeight={164} style={{ padding: 20 }}>
                {detectionResults.map((item) => (
                    <DetectionResultImage key={item.id} item={item} />
                ))}
            </ImageList>
        </Box>
    );
}

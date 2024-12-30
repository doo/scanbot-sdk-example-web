import { useEffect, useState } from "react";
import { SBStoreCroppedDetectionResult } from "scanbot-web-sdk/@types";
import SBSDKService from "../service/SBSDKService.tsx";
import ImageUtils from "../service/ImageUtils.ts";
import { Box } from "@mui/material";
import { TopBar } from "../subviews/TopBar.tsx";

export default function StorageDetailsPage() {

    const [item, setItem] = useState<SBStoreCroppedDetectionResult | null>(null);
    const [base64Image, setBase64Image] = useState<string | undefined>(undefined);

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
            const result = await SBSDKService.SDK.storage.getCroppedDetectionResult(itemId);
            setItem(result);
            const base64 = await ImageUtils.createBase64Image(result);
            setBase64Image(base64);
        }

        loadItem();
    }, []);

    return (
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100vw", height: "100vh" }}>
            <TopBar title={"Document Details"} isBackNavigationEnabled={true} />
            <h1>Storage Details</h1>
            <h3>Item ID: {item?.id}</h3>
            <img src={base64Image} alt={`Storage image ${item?.id}`}
                 style={{ width: "90%", maxHeight: 500, objectFit: "contain" }} />
        </Box>
    )
}

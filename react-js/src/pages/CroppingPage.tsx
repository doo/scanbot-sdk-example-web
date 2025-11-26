import { TopBar, TopBarHeight } from "../subviews/TopBar.tsx";
import { Box } from "@mui/material";
import { useEffect } from "react";
import SBSDKService from "../service/SBSDKService.ts";
import { CroppingViewConfiguration } from "scanbot-web-sdk/@types";

export default function StorageDetailsPage() {

    useEffect(() => {

        const search = location.href.split("?")[1];
        if (!search) {
            // TODO handle if missing
        }


        const itemId = parseInt(search.split("=")[1]);
        if (!itemId) {
            // TODO handle if missing
        }

        const loadItem = async () => {
            const sdk = await SBSDKService.awaitSDK();
            const result = await sdk.storage.getDocumentScannerResponse(itemId);

            const config: CroppingViewConfiguration = {
                containerId: "cropping-container",
                image: result.originalImage
            };
            SBSDKService.SDK.openCroppingView(config);
        };
        loadItem()
    }, []);

    return (
        <Box style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
            backgroundColor: "white"
        }}>
            <TopBar title={"Document Cropping"} isBackNavigationEnabled={true} />
            <div id={"cropping-container"} style={{ width: "100%", height: `calc(100% - ${TopBarHeight}px)` }} />
        </Box>
    );
}

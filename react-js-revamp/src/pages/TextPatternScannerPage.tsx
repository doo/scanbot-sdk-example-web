import { Box } from "@mui/material";
import { TopBar } from "../subviews/TopBar.tsx";
import { ContainerId } from "../service/SBSDKService.tsx";

export default function TextPatternScannerPage() {
    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"Text Pattern Scanner"} isBackNavigationEnabled={true} />
            <div id={ContainerId.TextPatternScanner} style={{ width: "100%", height: "100%" }}></div>
        </Box>
    )
}

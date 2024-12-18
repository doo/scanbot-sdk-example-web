import { Box } from "@mui/material";
import { TopBar } from "../subviews/TopBar.tsx";
import { ContainerId } from "../service/SBSDKService.tsx";

export default function MrzScannerPage() {
    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"MRZ Scanner"} isBackNavigationEnabled={true} />
            <div id={ContainerId.MrzScanner} style={{ width: "100%", height: "100%" }}></div>
        </Box>
    )
}

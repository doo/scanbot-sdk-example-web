import { Box } from "@mui/material";
import { TopBar } from "../subviews/TopBar.tsx";

export default function TextPatternScannerPage() {
    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"Text Pattern Scanner"} isBackNavigationEnabled={true} />
            <div id="text-pattern-scanner-container" style={{ width: "100%", height: "100%" }}></div>
        </Box>
    )
}

import { Box } from "@mui/material";
import { TopBar } from "../subviews/TopBar.tsx";

export default function BarcodeScannerPage() {
    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={"Barcode Scanner"} isBackNavigationEnabled={true} />
            <div id="barcode-scanner-container" style={{ width: "100%", height: "100%" }}></div>
        </Box>
    )
}

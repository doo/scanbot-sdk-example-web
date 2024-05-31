import { Box } from "@mui/material";
import NavigationBar from "../subviews/NavigationBar";
import SBStorage from "../service/SBStorage";

export default function BarcodeResultPage() {

    return (
        <Box sx={{ width: '100%', height: "100%", bgcolor: 'background.paper' }}>
            <NavigationBar isBackButtonVisible={true} />
            {SBStorage.instance.getBarcodes()?.map((barcode, index) => {
                return (
                    <Box key={index} sx={{ padding: 2, borderBottom: "1px solid #e0e0e0" }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Box sx={{ fontWeight: 500, fontSize: 14, color: "rgb(200, 25, 60)" }}>{barcode.text}</Box>
                            <Box sx={{ paddingLeft: 1, fontSize: 14, color: "rgb(100, 100, 100)" }}>{"(" + barcode.type + ")"}</Box>
                            <Box sx={{ paddingLeft: 1, fontSize: 14, color: "rgb(0, 0, 0)" }}>{"x" + barcode.count}</Box>
                        </Box>
                    </Box>
                )
            })}
        </Box>
    )
}
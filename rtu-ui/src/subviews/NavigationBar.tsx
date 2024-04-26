import { AppBar, Typography } from "@mui/material";

export default function NavigationBar() {
    return (
        <AppBar position="static" style={{ height: 52, backgroundColor: "rgb(200, 25, 60)" }}>
            <Typography style={{
                height: "100%",
                display: "flex",
                flexDirection: "row",
                paddingLeft: 15
            }}>
                <span style={{ fontWeight: 500, paddingRight: 6, fontSize: 20, lineHeight: "52px" }}>RTU UI</span>
                <span style={{ fontWeight: 300, lineHeight: "55px" }}>Example</span>
            </Typography>
        </AppBar>
    )
}
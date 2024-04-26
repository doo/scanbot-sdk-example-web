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
                <p style={{ fontWeight: 500, paddingRight: 6 }}>RTU UI</p>
                <p style={{ fontWeight: 300 }}>Example</p>
            </Typography>
        </AppBar>
    )
}
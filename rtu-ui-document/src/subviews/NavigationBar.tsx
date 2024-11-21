import { ArrowBack } from "@mui/icons-material";
import { AppBar, IconButton, Typography } from "@mui/material";

class Props {
    isBackButtonVisible?: boolean;
}

export function BackButton(props: { isVisible: boolean }) {

    if (!props.isVisible) {
        return null;
    }
    return (
        <IconButton aria-label="delete" size="small" style={{ width: 50, height: 50 }} onClick={() => {
            window.history.back();
        }}>
            <ArrowBack fontSize="inherit" style={{ color: "white", fontSize: 25 }} />
        </IconButton>
    )

}
export default function NavigationBar(props: Props) {
    return (
        <AppBar position="static" style={{ height: 52, backgroundColor: "rgb(200, 25, 60)", display: "flex", flexDirection: "row" }}>

            <BackButton isVisible={props.isBackButtonVisible ?? false} />

            <Typography style={{
                height: "100%",
                display: "flex",
                flexDirection: "row",
                paddingLeft: 15
            }}>
                <span style={{ fontWeight: 500, paddingRight: 6, fontSize: 20, lineHeight: "52px" }}>Document RTU UI</span>
                <span style={{ fontWeight: 300, lineHeight: "55px" }}>Example</span>
            </Typography>
        </AppBar>
    )
}
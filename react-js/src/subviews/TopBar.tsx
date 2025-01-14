import { Box, IconButton } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const TopBarHeight = 50;

class Props {
    isBackNavigationEnabled?: boolean = false;
    title?: string;
}

export function TopBar(props: Props) {
    const navigate = useNavigate();
    return <>
        <Box sx={{
            backgroundColor: "#c8193c",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: TopBarHeight,
            width: "100vw",
        }}>
            <Box style={{ flexBasis: 0, flexGrow: 1 }}>
                <IconButton
                    style={{ visibility: props.isBackNavigationEnabled ? "visible" : "hidden", color: "white" }}
                    onClick={() => {
                        navigate(-1);
                    }}>
                    <ArrowBack />
                </IconButton>
            </Box>
            <Box style={{ fontSize: 18, fontWeight: 500, textAlign: "center" }}>{props.title}</Box>
            <Box style={{ flexBasis: 0, flexGrow: 1 }}>
                {/* Placeholder */}
            </Box>
        </Box>
    </>;
}

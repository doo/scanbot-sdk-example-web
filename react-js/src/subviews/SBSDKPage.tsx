
import { Box } from "@mui/material";

import { TopBarHeight, TopBar } from "./TopBar.tsx";
import { ContainerId } from "../service/SBSDKService.ts";

export default function SBSDKPage(props: { title: string, containerId: ContainerId }) {

    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={props.title} isBackNavigationEnabled={true} />
            <div id={props.containerId} style={{ width: "100%", height: `calc(100% - ${TopBarHeight}px)` }} />
        </Box>
    )
}

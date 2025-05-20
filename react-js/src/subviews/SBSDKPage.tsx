import { Box } from "@mui/material";

import { TopBarHeight, TopBar } from "./TopBar.tsx";
import { ContainerId } from "../service/SBSDKService.ts";
import { Toast, TOAST_DEFAULT_TIMEOUT, ToastProps } from "./Toast.tsx";
import { useEffect, useRef, useState } from "react";

export default function SBSDKPage(props: { title: string, containerId: ContainerId, toast?: ToastProps }) {

    const toastResetTimer = useRef<number | null>(null);
    const [toast, setToast] = useState<ToastProps | undefined>(props.toast);

    useEffect(() => {
        // Transmute the toast prop into a state variable in order to manage its timeout,
        // else Toast.tsx is unable to show a toast with the same text repeatedly.
        setToast(props.toast);
        if (toastResetTimer.current === null) {
            toastResetTimer.current = setTimeout(() => {
                toastResetTimer.current = null;
                setToast(undefined);
            }, TOAST_DEFAULT_TIMEOUT);
        }
    }, [props.toast]);

    return (
        <Box style={{ width: "100vw", height: "100vh" }}>
            <TopBar title={props.title} isBackNavigationEnabled={true} />
            <div id={props.containerId} style={{ width: "100%", height: `calc(100% - ${TopBarHeight}px)` }} />
            <Toast text={toast?.text} color={toast?.color} />
        </Box>
    )
}

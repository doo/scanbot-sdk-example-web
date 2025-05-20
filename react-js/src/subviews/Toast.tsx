import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

export class ToastProps {
    color?: "GREEN" | "YELLOW" = "GREEN";
    text?: string;
}

export const TOAST_DEFAULT_TIMEOUT = 3000;

export function Toast(props: ToastProps) {
    const [toast, setToast] = React.useState<string | null>(null);

    useEffect(() => {
        if (props.text) {
            setToast(props.text);
        }
    }, [props.text]);

    return (

        <Snackbar open={toast !== null} autoHideDuration={TOAST_DEFAULT_TIMEOUT} onClose={() => setToast(null)}>
            <Alert
                onClose={() => setToast(null)}
                severity={props.color === "YELLOW" ? "warning" : "success"}
                variant="filled"
                sx={{ width: '100%' }}
                style={{ maxWidth: "90%", maxHeight: "80%" }}
            >
                {toast}
            </Alert>
        </Snackbar>
    )
}

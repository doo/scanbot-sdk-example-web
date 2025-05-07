import React, { useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

export class Props {
    text?: string;
}

export function Toast(props: Props) {
    const [toast, setToast] = React.useState<string | null>(null);

    useEffect(() => {
        if (props.text) {
            setToast(props.text);
        }
    }, [props.text]);

    return (

        <Snackbar open={toast !== null} autoHideDuration={3000} onClose={() => setToast(null)}>
            <Alert
                onClose={() => setToast(null)}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {toast}
            </Alert>
        </Snackbar>
    )
}

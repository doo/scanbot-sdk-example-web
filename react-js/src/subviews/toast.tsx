import React from "react";
import {Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { IconButton } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

function Alert(props: any) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export class Toast extends React.Component<any, any> {
    render() {
        const snackProps: any = {};
        if (this.props.alert?.autoClose) {
            snackProps.autoHideDuration = 2000;
        }

        return (
            <Snackbar open={!!this.props.alert} onClose={this.props.onClose} {...snackProps}>
                <Alert onClose={this.props.onClose} severity={this.props.alert?.color}>
                    {this.props.alert?.text}
                </Alert>
            </Snackbar>
        );
    }
}

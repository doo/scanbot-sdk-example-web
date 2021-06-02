import {CircularProgress} from "@material-ui/core";
import React from "react";

export default class LoadingScreen extends React.Component<any, any> {

    render() {

        if (!this.props.isVisible) {
            return null;
        }

        return (
            <div style={{position: "fixed", top: 0, width: "100%", height: "100%"}}>
                <div style={{transform: "translate(45%, 500%)"}}>
                    <CircularProgress/>
                </div>
            </div>
        );
    }
}

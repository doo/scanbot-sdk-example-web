
import React from "react";
import {ArrowBack, MoreVert} from "@material-ui/icons";
import {Constants} from "../model/constants";

export default class ActionBarTop extends React.Component<any, any> {

    buttonStyle(paddingLeft: boolean) {
        const style: any = {color: "white", height: "52px", width: "30px", zIndex: 100};
        if (paddingLeft) {
            style.paddingLeft = "10px";
        } else {
            style.paddingRight = "10px";
        }
        return style;
    };

    render() {
        return (
            <div style={Constants.barStyle()}>
                <ArrowBack
                    style={this.buttonStyle(true)}
                    onClick={this.props.onBack}
                />

                <div style={Constants.barText()}>{this.props.title}</div>
                <MoreVert
                    style={this.buttonStyle(false)}
                    onClick={() => { console.log("wuuut"); }}
                />
            </div>
        );
    }
}

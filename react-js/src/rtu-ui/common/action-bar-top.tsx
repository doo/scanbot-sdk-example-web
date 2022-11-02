import React from "react";
import { ArrowBack, Camera } from "@material-ui/icons";
import { Constants } from "../model/constants";

export default class ActionBarTop extends React.Component<any, any> {
  render() {
    return (
      <div style={Constants.barStyle()}>
        <ArrowBack
          style={{
            color: "white",
            height: "52px",
            paddingLeft: "10px",
            zIndex: 100,
          }}
          onClick={this.props.onBack}
        />

        <div style={Constants.barText()}>{this.props.title}</div>
        {this.props.onCameraSwitch && <Camera
          style={{
            color: "white",
            height: "52px",
            paddingRight: "10px",
            zIndex: 100,
          }}
          onClick={this.props.onCameraSwitch}
        />}
      </div>
    );
  }
}

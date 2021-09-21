import React, { CSSProperties } from "react";
import { Constants } from "../model/constants";

export default class ActionBarBottom extends React.Component<any, any> {
  buttonStyle(): CSSProperties {
    return {
      lineHeight: "52px",
      height: "100%",
      backgroundColor: "transparent",
      color: "white",
      border: "none",
      fontSize: "1em",
      fontWeight: 500,
      paddingLeft: "10px",
      paddingRight: "10px",
    };
  }

  render() {
    return (
      <div
        style={{
          ...Constants.barStyle(),
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div id={"count-label"} style={this.buttonStyle()}>
          {this.props.label}
        </div>
        <div style={{ right: 0, position: "absolute" }}>
          <button onClick={this.props.onDone} style={this.buttonStyle()}>
            {"Done"}
          </button>
        </div>
      </div>
    );
  }
}

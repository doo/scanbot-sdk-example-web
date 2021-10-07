import React, { CSSProperties } from "react";

export default class ErrorLabel extends React.Component<any, any> {
  style(): CSSProperties {
    return {
      textAlign: "center",
      marginTop: "80px",
      marginBottom: "20px",
      color: "red",
      fontWeight: 500,
    };
  }

  render() {
    if (!this.props.message) {
      return null;
    }

    return <div style={this.style()}>{this.props.message}</div>;
  }
}

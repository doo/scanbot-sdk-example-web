import React from "react";
import { Styles } from "../model/styles";
import { Toolbar } from "@material-ui/core";

export class NavigationContent extends React.Component<any, any> {
  render() {
    return (
      <div style={{ display: "flex", flexDirection: "row", background: "#c8193c"}}>
        {this.props.backVisible && (
          <button
            style={Styles.backButton}
            onClick={this.props.onBackClick}
            dangerouslySetInnerHTML={{ __html: "&#8249" }}
          />
        )}
        <Toolbar>SCANBOT WEB SDK EXAMPLE</Toolbar>
      </div>
    );
  }
}

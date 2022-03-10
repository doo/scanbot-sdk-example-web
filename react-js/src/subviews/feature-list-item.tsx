import React from "react";

export default class FeatureListItem extends React.Component<any, any> {
  render() {
    const style = {
      width: "97%",
      height: "50px",
      borderBottom: "1px solid lightgray",
      lineHeight: "50px",
      marginLeft: "3%",
    };
    return (
      <div id={this.props.id} onClick={() => this.props.onClick(this.props.data)} style={style}>
        {this.props.data.name}
      </div>
    );
  }
}

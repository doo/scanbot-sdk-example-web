import React from "react";

export class BottomBar extends React.Component<any, any> {

    render() {
        if (this.props.hidden) {
            return null;
        }
        return <div style={{width: "100%", height: this.props.style.height, backgroundColor: "#c8193c"}}>

        </div>
    }
}

import React from "react";

export class BottomBar extends React.Component<any, any> {

    render() {
        if (this.props.hidden) {
            return null;
        }
        return <div
            style={{width: "100%", height: this.props.style.height, backgroundColor: "#c8193c", display: "flex"}}>
            {this.props.buttons && this.createButtons()}
        </div>
    }

    private createButtons() {
        return this.props.buttons.map((button: any) => this.createButton(button));
    }
    private createButton(data: any) {
        const button = <button key={data.text} style={{
            width: "80px",
            fontSize: "14px",
            fontWeight: "bold",
            height: "100%",
            textAlign: "center",
            lineHeight: "50px",
            color: "white",
            padding: 0,
            margin: 0,
            border: "none",
            backgroundColor: "transparent"
        }} onClick={data.action}>{data.text}</button>;

        if (data.right) {
            return <div key={data.text} style={{right: "8px", position: "absolute"}}>{button}</div>
        }
        return button;
    }
}

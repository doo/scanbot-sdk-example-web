import React from "react";
import {Styles} from "../model/styles";

export class BottomBar extends React.Component<any, any> {

    render() {
        if (this.props.hidden) {
            return null;
        }
        return <div className='bottomBar'> {this.props.buttons && this.createButtons()} </div>
    }

    private createButtons() {
        return this.props.buttons.map((button: any) => this.createButton(button));
    }
    private createButton(data: any) {
        const button = <button key={data.text} className='bottomBar_button' onClick={data.action}>{data.text}</button>;

        if (data.right) {
            return <div key={data.text} className='bottomBar_button-right'>{button}</div>
        }
        return button;
    }
}

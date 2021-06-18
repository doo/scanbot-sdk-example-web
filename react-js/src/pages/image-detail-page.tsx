import React from "react";
import {Styles} from "../model/styles";
import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import Aux, {applyFilter} from "../auxiliary";

export default class ImageDetailPage extends React.Component<any, any>{

    render() {
        // const aux = new Aux()
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Header back={true}/>
                <img style={Styles.documentImage} src={this.props.image} alt={"."}/>
                <BottomBar
                    height={90}
                    buttons={[
                        // {text: "CROP", action: this.openCroppingUI.bind(this)},
                        {text: "FILTER", action: () => applyFilter(this.props.image)},
                        {text: "DELETE", action: () => {/*aux.deletePage()*/}, right: true}
                    ]}
                />
            </div>
        );
    }
}

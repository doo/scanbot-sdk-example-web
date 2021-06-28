
import React, {CSSProperties} from "react";

import Header from "./main-menu/header";

import {RoutePath} from "../service/routing-service";

export default class TextPage extends React.Component<any, any> {

    blockStyle(): CSSProperties {
        return {margin: "5px", whiteSpace: "break-spaces"}
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Header back={true} path={RoutePath.Home}/>
                <div style={this.blockStyle()}>{this.props.text}</div>
            </div>
        );
    }
}



import React from "react";
import {Styles} from "../model/Styles";

export default class ImageDetailPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(this.props.image);
        return (
            <div style={{width: "100%", height: "100%"}}>
                <img style={Styles.documentImage} src={this.props.image} alt={"."}/>
            </div>
        );
    }
}

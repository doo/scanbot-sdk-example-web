

import React, {CSSProperties} from "react";
import Pages from "../model/Pages";
import {Styles} from "../model/Styles";

export default class ImageDetailPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            image: []
        }
    }

    async componentDidMount(): Promise<void> {
        const index = parseInt(window.location.href.split("?")[1].split("=")[1]);
        const bytes = Pages.instance.imageAtIndex(index);
        if (bytes) {
            this.setState({image: await this.props.sdk.toDataUrl(bytes)});
        }

    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <img style={Styles.documentImage} src={this.state.image} alt={"."}/>
            </div>
        );
    }

    async imageFromPage(page: any): Promise<string> {
        return await this.props.sdk.toDataUrl(page.filtered ?? page.cropped ?? page.original);
    }
}

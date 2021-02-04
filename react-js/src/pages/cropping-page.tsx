
import React, {CSSProperties} from "react";
import Pages from "../model/Pages";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";

export default class CroppingPage extends React.Component<any, any>{

    VIEW_CONTAINER = "cropping-view";

    croppingView?: ICroppingViewHandle;

    constructor(props: any) {
        super(props);

        this.state = {
            image: []
        }
    }

    async componentDidMount(): Promise<void> {
        const href = window.location.href.split("?");
        if (href.length === 1) {
            console.log("No query parameters");
            return;
        }
        const index = parseInt(window.location.href.split("?")[1].split("=")[1]);
        const page = Pages.instance.objectAtIndex(index);

        if (!page) {
            console.log("No page to crop");
            return;
        }
        const configuration = {containerId: this.VIEW_CONTAINER, image: page.original, polygon:page.polygon};

        this.croppingView = this.props.sdk.openCroppingView(configuration);
    }

    render() {

        return (
            <div style={{height: "100%"}}>
                <div id={this.VIEW_CONTAINER} style={{width: "100%", height: "100%"}}/>
            </div>
        );
    }

}

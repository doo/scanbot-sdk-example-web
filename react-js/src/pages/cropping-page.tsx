
import React from "react";
import Pages from "../model/pages";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import { withRouter } from "react-router-dom";
import { RoutingService, RoutePath } from '../service/routing-service';

export default class CroppingPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            image: []
        }
    }

    async componentDidMount(): Promise<void> {
        // const href = window.location.href.split("?");
        // if (href.length === 1) {
        //     console.log("No query parameters");
        //     return;
        // }
        // const index = parseInt(window.location.href.split("?")[1].split("=")[1]);
        const index = parseInt(window.location.href.split("view-documents/")[1].split("/")[0]);
        const page = Pages.instance.objectAtIndex(index);

        if (!page) {
            console.log("No page to crop");
            return;
        }

        await ScanbotSdkService.instance.openCroppingView(page);
    }

    componentWillUnmount(): void {
        ScanbotSdkService.instance.disposeCroppingView();
    }

    async detect() {
        await ScanbotSdkService.instance.croppingView?.detect();
    }

    async rotate() {
        await ScanbotSdkService.instance.croppingView?.rotate(1);
    }

    async applyCrop() {
        const result = await ScanbotSdkService.instance.croppingView?.apply();
        Pages.instance.updateActiveItem(result);
        await ScanbotSdkService.instance.reapplyFilter();
        const index = Pages.instance.getActiveIndex();
        RoutingService.instance.manualGoTo(`${RoutePath.ViewDocuments}/${index}`, {updatedImage: await ScanbotSdkService.instance.documentImageAsBase64(index)} )
        // RoutingService.instance.back();
        // const index = Pages.instance.getActiveIndex();
        // this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
    }

    render() {

        return (
            <div style={{height: "100%"}}>
                <Header back={true}/>
                <div id={ScanbotSdkService.CROPPING_VIEW_CONTAINER} style={{width: "100%", height: "100%"}}/>
                <BottomBar
                    height={90}
                    buttons={[
                        {text: "DETECT", action: this.detect.bind(this)},
                        {text: "ROTATE", action: this.rotate.bind(this)},
                        {text: "APPLY", action: this.applyCrop.bind(this), right: true}
                    ]}
                />
            </div>
        );
    }
}
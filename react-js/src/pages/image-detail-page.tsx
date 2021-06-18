import React from "react";
import {Styles} from "../model/styles";
import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import Swal from 'sweetalert2';
import { ImageFilter } from 'scanbot-web-sdk/@types';
import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import Pages from '../model/pages';
import { RoutingService } from '../service/routing-service';

export default class ImageDetailPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            updatedImage: undefined
        }
    }

    openCroppingUI() {
        const index = Pages.instance.getActiveIndex();
        RoutingService.instance.manualGoTo(`${index}/cropping-view`, {index: index})
        // RoutingService.instance.crop(index, {index: index})
    }

    async applyFilter() {
        const page = Pages.instance.getActiveItem();
        const result = await Swal.fire({
            title: 'Select filter',
            input: 'select',
            inputOptions: ScanbotSdkService.instance.availableFilters(),
            inputPlaceholder: page.filter ?? "none"
        });

        const filter = ScanbotSdkService.instance.filterByIndex(result.value);

        // "None" is not an actual filter, only used in this example app
        if (filter === "none") {
            page.filter = undefined;
            page.filtered = undefined;
        } else {
            page.filter = filter;
            page.filtered = await ScanbotSdkService.instance.applyFilter(
                page.cropped ?? page.original,
                filter as ImageFilter);
        }

        const index = Pages.instance.getActiveIndex();
        this.setState({updatedImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
    }

    deletePage() {
        Pages.instance.removeActiveItem();
        RoutingService.instance.back()
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Header back={true}/>
                <img style={Styles.documentImage} src={this.state.updatedImage ?? this.props.image} alt={"."}/>
                <BottomBar
                    height={90}
                    buttons={[
                        {text: "CROP", action: this.openCroppingUI.bind(this)},
                        {text: "FILTER", action: this.applyFilter.bind(this)},
                        {text: "DELETE", action: this.deletePage.bind(this), right: true}
                    ]}
                />
            </div>
        );
    }
}

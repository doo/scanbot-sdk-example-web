
import React from "react";

import { ImageFilter } from 'scanbot-web-sdk/@types';

import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import FilterDialog from "../subviews/FilterDialog";

import Swal from 'sweetalert2';


import Pages from '../model/pages';

import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import { RoutePath, RoutingService } from '../service/routing-service';

export default class ImageDetailPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            filterDialog: {
                visible: false
            },
            updatedImage: undefined
        }
    }

    async componentDidMount() {
        const index = Pages.instance.getActiveIndex();
        this.setState({updatedImage: await ScanbotSdkService.instance.documentImageAsBase64(index)})
    }

    openCroppingUI() {
        const index = Pages.instance.getActiveIndex();
        RoutingService.instance.manualGoTo(`${index}/cropping-view`, {index: index})
    }

    async applyFilter() {

        this.setState({filterDialog: {visible: true}});
        return;

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
        RoutingService.instance.goTo(RoutePath.ViewDocuments)
    }

    render() {
        return (
            <div className='component-imageDetail'>
                <FilterDialog visible={this.state.filterDialog.visible} onClose={() => {
                    this.setState({filterDialog: {visible: false}})
                }}/>

                <Header back={true} path={RoutePath.ViewDocuments}/>
                <div className='imageDetailContainer'>
                    <img className='imageDetail' src={this.state.updatedImage ?? this.props.image} alt={"."}/>
                </div>
                <BottomBar
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

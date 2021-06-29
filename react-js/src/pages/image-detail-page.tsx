
import React from "react";

import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import FilterDialog from "../subviews/filter-dialog";

import Pages from '../model/pages';
import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import { RoutePath, RoutingService } from '../service/routing-service';
import DetailedImageFilter from "../model/DetailedImageFilter";

export default class ImageDetailPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            dialog: {
                visible: false,
                filters: []
            },
            updatedImage: undefined
        }
    }

    async componentDidMount() {
        const index = Pages.instance.getActiveIndex();
        this.setState({
            updatedImage: await ScanbotSdkService.instance.documentImageAsBase64(index),
        });
    }

    openCroppingUI() {
        const index = Pages.instance.getActiveIndex();
        RoutingService.instance.manualGoTo(`${index}/cropping-view`, {index: index})
    }

    async openFilterSelector() {
        this.setState({
            dialog: {
                visible: true,
                filters: ScanbotSdkService.instance.availableFilters(),
                currentFilter: Pages.instance.getActiveItem().filter
            }
        });
    }
    closeFilterSelector() {
        this.setState({dialog: {visible: false}})
    }

    async applyFilter(filter: DetailedImageFilter) {
        if (!filter) {
            return;
        }

        this.closeFilterSelector();

        const page = Pages.instance.getActiveItem();

        // "None" is not an actual filter, only used in this example app
        if (filter.name === "none") {
            page.filter = undefined;
            page.filtered = undefined;
        } else {
            const image = page.cropped ?? page.original;
            page.filter = filter;
            page.filtered = await ScanbotSdkService.instance.applyFilter(image, filter.name);
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
                <FilterDialog
                    data={this.state.dialog}
                    onClose={this.closeFilterSelector.bind(this)}
                    onApply={this.applyFilter.bind(this)}
                />

                <Header back={true} path={RoutePath.ViewDocuments}/>
                <div className='imageDetailContainer'>
                    <img className='imageDetail' src={this.state.updatedImage ?? this.props.image} alt={"."}/>
                </div>
                <BottomBar
                    buttons={[
                        {text: "CROP", action: this.openCroppingUI.bind(this)},
                        {text: "FILTER", action: this.openFilterSelector.bind(this)},
                        {text: "DELETE", action: this.deletePage.bind(this), right: true}
                    ]}
                />
            </div>
        );
    }
}

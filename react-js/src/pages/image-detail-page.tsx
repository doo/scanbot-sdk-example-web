import React from "react";
import {Styles} from "../model/styles";
import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";
import { withRouter } from "react-router-dom";
import Swal from 'sweetalert2';
import { ImageFilter } from 'scanbot-web-sdk/@types';
import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import Pages from '../model/pages';

class ImageDetailPage extends React.Component<any, any>{

    openCroppingUI() {
        // RoutingService.instance.route(RoutePath.CroppingView, {index: Pages.instance.getActiveIndex()});
        // this.props.history.push(`${this.props.match.url}/cropping-view`)
        this.props.history.push({
            pathname: `${this.props.match.url}/cropping-view`,
            // search: '?query=abc',
            state: {index: Pages.instance.getActiveIndex()}
        })
    }
    
    async applyFilter(image: any) {
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
        image = await ScanbotSdkService.instance.documentImageAsBase64(index);
    }
    
    deletePage() {
        Pages.instance.removeActiveItem();
        this.props.history.goBack()
    }

    render() {
        // const aux = new Aux()
        return (
            <div style={{width: "100%", height: "100%"}}>
                <Header back={true}/>
                <img style={Styles.documentImage} src={this.props.image} alt={"."}/>
                <BottomBar
                    height={90}
                    buttons={[
                        {text: "CROP", action: this.openCroppingUI.bind(this)},
                        {text: "FILTER", action: () => this.applyFilter(this.props.image)},
                        {text: "DELETE", action: () => this.deletePage(), right: true}
                    ]}
                />
            </div>
        );
    }
}

export default withRouter(ImageDetailPage)

import React from "react";
import Pages from "../model/pages";
import {GridList, GridListTile} from "@material-ui/core";
import {Styles} from "../model/styles";
import { withRouter, Route, Link } from 'react-router-dom';

import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";

import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import { ImageUtils } from '../utils/image-utils';
import { MiscUtils } from '../utils/misc-utils';
import { RoutePath, RoutingService } from '../service/routing-service';

export default class ImageResultsPage extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

        this.state = {
            images: []
        }
    }

    async componentDidMount(): Promise<void> {
        const images = [];
        const pages = Pages.instance.get();
        for (let i = 0; i < pages.length; i++) {
            images.push({index: i, base64: await this.imageFromPage(pages[i])})
        }

        this.setState({images: images})
    }

    render() {
        return (
            <div className='component-imageResults' style={{width: "100%", height: "100%"}}>
                <Header back={true}/>
                <GridList style={{height: "100%", margin: 0}} cellHeight={160} cols={3}>
                    {this.state.images.map((image: any) => {
                        return (
                            <GridListTile key={image.index} cols={1} onClick={(e) => {
                                this.props.onDetailButtonClick(image.index)
                                RoutingService.instance.viewDetails(image.index)
                                }
                            }>
                                <img style={Styles.documentImage} src={image.base64} alt={"."}/>

                            </GridListTile>
                        )
                    })}
                </GridList>
                <BottomBar
                    height={90}
                    buttons={[
                        {text: "SAVE PDF", action: this.savePDF.bind(this)},
                        {text: "SAVE TIFF", action: this.saveTIFF.bind(this)}
                    ]}
                />
            </div>
        );
    }

    async imageFromPage(page: any): Promise<string> {
        return await this.props.sdk.toDataUrl(page.filtered ?? page.cropped ?? page.original);
    }

    async savePDF() {
        const bytes = await ScanbotSdkService.instance.generatePDF(Pages.instance.get());
        ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".pdf");
    }
    
    async saveTIFF() {
        const bytes = await ScanbotSdkService.instance.generateTIFF(Pages.instance.get());
        ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".tiff");
    }

}
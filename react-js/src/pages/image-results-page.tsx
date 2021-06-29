import React from "react";
import Pages from "../model/pages";

import Header from "./main-menu/header";
import { BottomBar } from "../subviews/bottom-bar";

import { ScanbotSdkService } from '../service/scanbot-sdk-service';
import { ImageUtils } from '../utils/image-utils';
import { MiscUtils } from '../utils/misc-utils';
import { RoutePath, RoutingService } from '../service/routing-service';
import './viewDocuments-styles.scss'

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
            <div className='component-imageResults'>
                <Header back={true} path={RoutePath.Home}/>
                <div className='resultsGridContainer'>
                    <div className='resultsGrid' style={{padding: Pages.instance.count() > 0 ? '8px' : '0'}}>
                        {this.state.images.map((image: any) => {
                            return (
                                <div key={image.index} className='resultsGrid_tile' onClick={async (e) => {
                                    await this.onDetailButtonClick(image.index);
                                    RoutingService.instance.viewDetails(image.index)
                                }}>
                                    <img className='resultsGrid_image' src={image.base64} alt={"."}/>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <BottomBar
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

    async onDetailButtonClick(index: number) {
        Pages.instance.setActiveItem(index);
        this.setState({activeImage: await ScanbotSdkService.instance.documentImageAsBase64(index)});
    }

}

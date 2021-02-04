
import React, {CSSProperties} from "react";
import Pages from "../model/Pages";
import {GridList, GridListTile} from "@material-ui/core";
import {Link} from "react-router-dom";

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
        const imageStyle: CSSProperties = {
            width: "100%",
            height: "100%",
            transform: "none",
            top: "0",
            objectFit: "contain"
        };
        return (
            <div style={{width: "100%", height: "100%"}}>
                <GridList style={{height: "100%", margin: 0}} cellHeight={160} cols={3}>
                    {this.state.images.map((image: any) => {
                        return (
                            <GridListTile key={image.index} cols={1}>
                                <Link key={image.index}
                                      to={{pathname: "/image-details", search: "?index=" + image.index}}>
                                    <img style={imageStyle} src={image.base64} alt={"image"}/>
                                </Link>
                            </GridListTile>
                        )
                    })}
                </GridList>
            </div>
        );
    }

    async imageFromPage(page: any): Promise<string> {
        return await this.props.sdk.toDataUrl(page.filtered ?? page.cropped ?? page.original);
    }
}

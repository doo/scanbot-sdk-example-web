import React from 'react';
import FeatureListItem from "./feature-list-item";
import {Features} from "../model/features";
// @ts-ignore
import { ImagePicker, FilePicker } from 'react-file-picker';
import {RoutePath} from "../service/routing-service";

export default class FeatureList extends React.Component<any, any> {

    render() {
        return (
            <div>
                {Features.LIST.map(feature => {
                    if (feature.pick === "jpeg") {
                        return <ImagePicker
                            key={feature.id}
                            extensions={["jpg", "jpeg", "png"]}
                            accept={"image/*"}
                            dims={{minWidth: 0, minHeight: 0}}
                            onChange={async (base64: string) => {
                                this.props.onPick(feature, base64);
                            }}
                            onError={(message: string) => {
                                console.log("error", message);
                            }}
                        >
                            <FeatureListItem data={feature}/>
                        </ImagePicker>
                    }

                    if (feature.pick === "pdf") {
                        return <FilePicker
                            key={feature.id}
                            // extensions={['pdf']}
                            accept={"application/*"}
                            onChange={(file: any) => {
                                const reader = new FileReader();
                                if (feature.id === RoutePath.DocumentOnJpeg) {
                                    reader.readAsArrayBuffer(file);
                                } else {
                                    reader.readAsDataURL(file);
                                }

                                reader.onload = () => this.props.onPick(feature, reader.result);
                                reader.onerror = message => console.log("error", message);
                            }}
                            onError={(message: string) => {
                                console.log("error", message);
                            }}
                        >
                            <FeatureListItem data={feature}/>
                        </FilePicker>
                    }
                    return <FeatureListItem key={feature.id} onClick={() => {
                        this.props.onItemClick(feature)
                    }} data={feature}/>
                })}
            </div>
        )
    }
}

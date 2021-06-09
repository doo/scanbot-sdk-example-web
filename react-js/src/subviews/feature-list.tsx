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
                            maxSize={10}
                            onChange={async (base64: string) => {
                                this.props.onPick(feature, base64);
                            }}
                            onError={(message: string) => {
                                console.log("error", message);
                                this.props.onError(message);
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
                            maxSize={10}
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
                            onError={(error: any) => {
                                console.log("error what", error);
                                this.props.onError(error);
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

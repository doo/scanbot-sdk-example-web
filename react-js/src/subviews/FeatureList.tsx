import React from 'react';
import FeatureListItem from "./FeatureListItem";
import {Features} from "../model/Features";
import {Link} from "react-router-dom";

export default class FeatureList extends React.Component<any, any> {

    render() {
        return (
            <div>
                {Features.LIST.map(feature =>
                    <FeatureListItem key={feature.id} onClick={() => {this.props.onItemClick(feature)}} data={feature}/>
                )}
            </div>
        )
    }
}

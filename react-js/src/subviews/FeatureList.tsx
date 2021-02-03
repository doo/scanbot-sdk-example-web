import React from 'react';
import FeatureListItem from "./FeatureListItem";
import {Features} from "../model/Features";

export default class FeatureList extends React.Component<any, any> {

    render() {
        const style = {marginTop: "65px"};
        return (
            <div style={style}>
                {Features.LIST.map(feature => <FeatureListItem key={feature.id} onClick={this.props.onItemClick} data={feature}/>)}
            </div>
        )
    }
}

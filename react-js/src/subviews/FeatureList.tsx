import React from 'react';
import FeatureListItem from "./FeatureListItem";
import {Features} from "../model/Features";
import {Link} from "react-router-dom";

export default class FeatureList extends React.Component<any, any> {

    render() {
        return (
            <div style={{marginTop: "65px"}}>
                {Features.LIST.map(feature =>
                    <Link  key={feature.id} style={{textDecoration: "none", color: "rgb(50, 50, 50)"}} to={feature.route ?? "/"}>
                        <FeatureListItem onClick={this.props.onItemClick} data={feature}/>
                    </Link>
                )}
            </div>
        )
    }
}

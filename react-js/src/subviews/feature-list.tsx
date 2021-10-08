import React from "react";
import FeatureListItem from "./feature-list-item";
import { Features } from "../model/features";

export default class FeatureList extends React.Component<any, any> {
  render() {
    return (
      <div>
        {Features.LIST.map((feature) => (
          <FeatureListItem
            key={feature.id}
            onClick={() => {
              this.props.onItemClick(feature);
            }}
            data={feature}
          />
        ))}
      </div>
    );
  }
}

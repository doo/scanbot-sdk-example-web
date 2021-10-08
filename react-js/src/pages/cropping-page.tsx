import React from "react";
import Pages from "../model/pages";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";

export default class CroppingPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      image: [],
    };
  }

  async componentDidMount(): Promise<void> {
    const href = window.location.href.split("?");
    if (href.length === 1) {
      console.log("No query parameters");
      return;
    }
    const index = parseInt(window.location.href.split("?")[1].split("=")[1]);
    const page = Pages.instance.objectAtIndex(index);

    if (!page) {
      console.log("No page to crop");
      return;
    }

    await ScanbotSdkService.instance.openCroppingView(page);
  }

  componentWillUnmount(): void {
    ScanbotSdkService.instance.disposeCroppingView();
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div
          id={ScanbotSdkService.CROPPING_VIEW_CONTAINER}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}

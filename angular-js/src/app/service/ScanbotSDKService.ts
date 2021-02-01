import {Injectable} from "@angular/core";
import ScanbotSDK from "scanbot-web-sdk/webpack";

@Injectable()
export class ScanbotSDKService {

  static CONTAINER_ID = "scanbot-camera-container";

  instance: ScanbotSDK;


  onReady: any;

  isReady(): boolean {
    return this.instance !== undefined;
  }

  constructor() {
    console.log("asifajf");
    const options = {licenseKey: ""};
    ScanbotSDK.initialize(options).then(result => {
      this.instance = result;
      if (this.onReady) {
        this.onReady();
      }
    });
  }
}

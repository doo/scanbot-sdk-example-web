import { Component } from '@angular/core';
import ScanbotSDK from "scanbot-web-sdk/component/scanbot-sdk";
import {InitializationOptions} from "scanbot-web-sdk/component/model/initialization-options";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/component/model/document-scanner-configuration";
import "scanbot-web-sdk/component/styles/main.css";
import "scanbot-web-sdk/component/styles/shutter.css";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  SDK: ScanbotSDK;
  constructor() {
    console.log("constructed")
  }

  async ngOnInit() {
    const options: InitializationOptions = {
      // License key is a required parameter, leave empty for trial
      licenseKey: ""
      // Optional: configure another source for the engine
      // engine: "lib/"
    };
    this.SDK = await ScanbotSDK.initialize(options);

    const configuration: DocumentScannerConfiguration = {
      containerId: "scanbot-camera-container"
    };
    await this.SDK.createDocumentScanner(configuration);
  }

}

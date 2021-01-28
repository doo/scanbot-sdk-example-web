import {Component} from "@angular/core";

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {InitializationOptions} from "scanbot-web-sdk/@types/model/configuration/initialization-options";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";

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

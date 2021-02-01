import {Component} from "@angular/core";

// Import SDK from webpack directory to ensure web assembly binary and worker and bundled with webpack
import ScanbotSDK from "scanbot-web-sdk/webpack";

// Other typings should be imported from @types
import {InitializationOptions} from "scanbot-web-sdk/@types/model/configuration/initialization-options";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ICroppingViewHandle} from "scanbot-web-sdk/@types/interfaces/i-cropping-view-handle";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  features: any = [
    { name: "Scan Documents", action: () => {}},
    { name: "Pick image", action: () => {}},
    { name: "Image Results", action: () => {}},
    { name: "Check License", action: () => {}}
  ];

  SCANNER_CONTAINER = "scanbot-camera-container";

  license = "";
  SDK: ScanbotSDK | undefined;

  documentScanner?: IDocumentScannerHandle;
  croppingView?: ICroppingViewHandle;

  async ngOnInit() {
    const options: InitializationOptions = {
      // License key is a required parameter, leave empty for trial
      licenseKey: ""
      // Optional: configure another source for the engine
      // engine: "lib/"
    };

    // this.SDK = await ScanbotSDK.initialize(options);

    // const configuration: DocumentScannerConfiguration = {
    //   onDocumentDetected: this.onDocumentDetected.bind(this),
    //   containerId: this.SCANNER_CONTAINER
    // };
    //
    // await this.SDK.createDocumentScanner(configuration);
  }

  async onDocumentDetected(result: DetectionResult) {
    console.log("Detected document: ", result);
    const image = result.cropped ?? result.original;
    this.documentScanner?.dispose();
    const config: CroppingViewConfiguration = {
      image: image,
      polygon: result.polygon,
      containerId: this.SCANNER_CONTAINER
    };
    this.croppingView = await this.SDK?.openCroppingView(config);
  }
}

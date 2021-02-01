import { Component, OnInit } from '@angular/core';
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {Router} from "@angular/router";
import {NavigationUtils} from "../service/navigation-utils";

@Component({
  selector: 'app-document-scanner',
  templateUrl: './document-scanner.component.html',
  styleUrls: ['./document-scanner.component.scss']
})
export class DocumentScannerComponent implements OnInit {

  documentScanner?: IDocumentScannerHandle;

  router: Router;
  sdk: ScanbotSdkService;

  constructor(_router: Router, sdk: ScanbotSdkService) {
    this.router = _router;
    this.sdk = sdk;
  }
  async ngOnInit(): Promise<void> {

    NavigationUtils.showBackButton(true);
    if (!this.sdk.isReady()) {
      this.sdk.onReady = () => {
        this.startScanner();
      }
    } else {
      this.startScanner();
    }

  }

  async startScanner() {
    const configuration: DocumentScannerConfiguration = {
      onDocumentDetected: this.onDocumentDetected.bind(this),
      containerId: ScanbotSdkService.CONTAINER_ID
    };

    await this.sdk.scan(configuration);
  }

  async onDocumentDetected(result: DetectionResult) {
    console.log("Detected document: ", result);
    const image = result.cropped ?? result.original;
    this.documentScanner?.dispose();
    // const config: CroppingViewConfiguration = {
    //   image: image,
    //   polygon: result.polygon,
    //   containerId: ScanbotSDKService.CONTAINER_ID
    // };
    // this.croppingView = await this.SDK?.openCroppingView(config);
  }
}

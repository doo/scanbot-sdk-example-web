import { Component, OnInit } from '@angular/core';
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ScanbotSDKService} from "../service/ScanbotSDKService";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {Router} from "@angular/router";

@Component({
  selector: 'app-document-scanner',
  templateUrl: './document-scanner.component.html',
  styleUrls: ['./document-scanner.component.scss']
})
export class DocumentScannerComponent implements OnInit {

  documentScanner?: IDocumentScannerHandle;

  router: Router;
  sdk: ScanbotSDKService;

  constructor(_router: Router, sdk: ScanbotSDKService) {
    this.router = _router;
    this.sdk = sdk;
  }
  async ngOnInit(): Promise<void> {

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
      containerId: ScanbotSDKService.CONTAINER_ID
    };

    await this.sdk.instance.createDocumentScanner(configuration);
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

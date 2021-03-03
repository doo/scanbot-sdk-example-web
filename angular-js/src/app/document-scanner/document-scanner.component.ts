import { Component, OnInit } from '@angular/core';
import {
  DocumentDetectionResult,
  DocumentScannerConfiguration
} from "scanbot-web-sdk/@types";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {Router} from "@angular/router";
import {NavigationUtils} from "../service/navigation-utils";
import {DocumentRepository} from "../service/document-repository";
import ViewUtils from "../service/view-utils";

@Component({
  selector: 'app-document-scanner',
  templateUrl: './document-scanner.component.html',
  styleUrls: ['./document-scanner.component.scss']
})
export class DocumentScannerComponent implements OnInit {

  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  constructor(_router: Router, _sdk: ScanbotSdkService, _documents: DocumentRepository) {
    this.router = _router;
    this.sdk = _sdk;
    this.documents = _documents;
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

  async onDocumentDetected(result: DocumentDetectionResult) {
    ViewUtils.flash();
    this.documents.add(result);
    const counter = NavigationUtils.getElementByClassName("scanner-page-counter");
    counter.innerText = this.documents.count() + " PAGES";
    this.sdk.delayAutoCapture();
  }

  async onScanningDone() {
    this.sdk.disposeScanner();
    await this.router.navigateByUrl("/");
  }

}

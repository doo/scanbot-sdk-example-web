import { Component, OnInit } from '@angular/core';
import {DetectionResult} from "scanbot-web-sdk/@types/model/response/detection-result";
import {CroppingViewConfiguration} from "scanbot-web-sdk/@types/model/configuration/cropping-view-configuration";
import {IDocumentScannerHandle} from "scanbot-web-sdk/@types/interfaces/i-document-scanner-handle";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentScannerConfiguration} from "scanbot-web-sdk/@types/model/configuration/document-scanner-configuration";
import {Router} from "@angular/router";
import {NavigationUtils} from "../service/navigation-utils";
import {DocumentRepository} from "../service/document-repository";

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

  async onDocumentDetected(result: DetectionResult) {
    this.flash();
    this.documents.add(result);
    const counter = NavigationUtils.getElementByClassName("scanner-page-counter");
    counter.innerText = this.documents.count() + " PAGES";
    this.sdk.delayAutoCapture();
  }

  async onScanningDone() {
    this.sdk.disposeScanner();
    await this.router.navigateByUrl("/");
  }

  flash() {
    const flash = document.getElementsByClassName("flash")[0] as HTMLDivElement;
    flash.style.display = "block";

    this.animateFlashOpacity("0.5", () => {
      this.animateFlashOpacity("0.0", () => {
        flash.style.opacity = "1.0";
        flash.style.display = "none";
      })
    });
  }
  animateFlashOpacity(opacity, complete) {
    const flash = document.getElementsByClassName("flash")[0] as HTMLDivElement;
    setTimeout(() => {
      flash.style.opacity = opacity;
      complete();
    }, 150);
  }
}

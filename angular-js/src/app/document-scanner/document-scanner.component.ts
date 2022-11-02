import { Component, OnInit } from "@angular/core";
import {
  DocumentDetectionResult,
  DocumentScannerConfiguration,
} from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { Router } from "@angular/router";
import { NavigationUtils } from "../service/navigation-utils";
import { DocumentRepository } from "../service/document-repository";
import ViewUtils from "../service/view-utils";

@Component({
  selector: "app-document-scanner",
  templateUrl: "./document-scanner.component.html",
  styleUrls: ["./document-scanner.component.scss"],
})
export class DocumentScannerComponent implements OnInit {
  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  constructor(
    _router: Router,
    _sdk: ScanbotSdkService,
    _documents: DocumentRepository
  ) {
    this.router = _router;
    this.sdk = _sdk;
    this.documents = _documents;
  }

  async ngOnInit(): Promise<void> {
    NavigationUtils.showBackButton(true);
    NavigationUtils.showCameraSwapButton(true);
    if (!this.sdk.isReady()) {
      this.sdk.onReady = () => {
        this.startScanner();
      };
    } else {
      this.startScanner();
    }
  }

  async startScanner() {
    const configuration: DocumentScannerConfiguration = {
      onDocumentDetected: this.onDocumentDetected.bind(this),
      containerId: ScanbotSdkService.CONTAINER_ID,
      text: {
        hint: {
          OK: "Capturing your document...",
          OK_SmallSize: "The document is too small. Try moving closer.",
          OK_BadAngles:
            "This is a bad camera angle. Hold the device straight over the document.",
          OK_BadAspectRatio:
            "Rotate the device sideways, so that the document fits better into the screen.",
          OK_OffCenter: "Try holding the device at the center of the document.",
          Error_NothingDetected:
            "Please hold the device over a document to start scanning.",
          Error_Brightness: "It is too dark. Try turning on a light.",
          Error_Noise: "Please move the document to a clear surface.",
        },
      },
    };

    await this.sdk.scanDocuments(configuration, this.documentScannerError.bind(this));
  }

  documentScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.router.navigateByUrl("/");
  }

  async onDocumentDetected(result: DocumentDetectionResult) {
    ViewUtils.flash();
    this.documents.add(result);
    const counter = NavigationUtils.getElementByClassName(
      "scanner-page-counter"
    );
    counter.innerText = this.documents.count() + " PAGES";
    this.sdk.delayAutoCapture();
  }

  async onScanningDone() {
    this.sdk.disposeDocumentScanner();
    await this.router.navigateByUrl("/");
  }
}

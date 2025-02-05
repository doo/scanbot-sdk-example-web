import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  CroppedDetectionResult,
  DocumentDetectionResult,
  DocumentScannerConfiguration, DocumentScannerViewConfiguration,
} from "scanbot-web-sdk/@types";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { Router } from "@angular/router";
import { NavigationUtils } from "../service/navigation-utils";
import { DocumentRepository, SBDocumentResult } from "../service/document-repository";
import ViewUtils from "../service/view-utils";
import { Utils } from "../service/utils";

@Component({
  selector: "app-document-scanner",
  templateUrl: "./document-scanner.component.html",
  styleUrls: ["./document-scanner.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
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
    NavigationUtils.showCameraSwitchButton(true);

    if (!this.sdk.isReady()) {
      this.sdk.onReady = () => {
        this.startScanner();
      };
    } else {
      this.startScanner();
    }
  }

  async startScanner() {
    /**
     * If you're using ViewEncapsulation.ShadowDom, providing 'containerId' will not work,
     * as it's not accessible using conventional methods. In this case, it's required that you provide
     * the container property directly, by accessing the shadowRoot yourself, as shown below.
     */
    const shadow = document.querySelector("app-document-scanner").shadowRoot;
    const container = shadow.getElementById(ScanbotSdkService.CONTAINER_ID);

    const configuration: DocumentScannerViewConfiguration = {
      onDocumentDetected: this.onDocumentDetected.bind(this),
      container,
      text: {
        hint: {
          OK: "Capturing your document...",
          OK_BUT_TOO_SMALL: "The document is too small. Try moving closer.",
          OK_BUT_BAD_ANGLES:
            "This is a bad camera angle. Hold the device straight over the document.",
          OK_BUT_BAD_ASPECT_RATIO:
            "Rotate the device sideways, so that the document fits better into the screen.",
          OK_BUT_OFF_CENTER: "Try holding the device at the center of the document.",
          OK_BUT_TOO_DARK: "It is too dark. Try turning on a light.",
          ERROR_NOTHING_DETECTED:
            "Please hold the device over a document to start scanning.",
          ERROR_TOO_DARK: "It is too dark. Try turning on a light.",
          ERROR_TOO_NOISY: "Please move the document to a clear surface.",
          NOT_ACQUIRED: "Hold the device over a document to start scanning.",
          OK_BUT_ORIENTATION_MISMATCH: "Please rotate the device to portrait mode.",
        },
        initializing: {
          enabled: true,
          value: "Please wait a moment...",
        },
      },
      style: {
        // Note that alternatively, styling the document scanner is also possible using CSS classes.
        // For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
        outline: {
          polygon: {
            strokeCapturing: "green",
            strokeWidthCapturing: 4
          }
        }
      },
      onError: this.documentScannerError.bind(this),
      preferredCamera: 'camera2 0, facing back'
    };

    try {
      await this.sdk.scanDocuments(configuration);
    } catch (e) {
      this.documentScannerError(e);
      this.router.navigateByUrl("/");
    }
  }

  documentScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    Utils.alert(e.name + ': ' + e.message);
  }

  async onDocumentDetected(result: CroppedDetectionResult) {
    ViewUtils.flash();
    const document: SBDocumentResult = {
      originalImage: result.originalImage,
      croppedImage: result.croppedImage,
      polygon: result.pointsNormalized,
    }
    this.documents.add(document);
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

  async onBack() {
    this.onScanningDone();
  }

  async onCameraSwap() {
    this.sdk.swapDocumentScannerCameraFacing();
  }

  async onCameraSwitch() {
    this.sdk.switchDocumentScannerCameraFacing();
  }
}

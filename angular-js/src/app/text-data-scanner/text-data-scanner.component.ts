import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ToastrService } from "ngx-toastr";
import { TextDataScannerConfiguration, TextDataScannerResult } from "scanbot-web-sdk/@types";
import { Utils } from "../service/utils";

@Component({
  selector: "app-text-data-scanner",
  templateUrl: "./text-data-scanner.component.html",
  styleUrls: ["./text-data-scanner.component.scss"],
})
export class TextDataScannerComponent implements OnInit {
  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  constructor(
    _router: Router,
    _sdk: ScanbotSdkService,
    _documents: DocumentRepository,
    private toastr: ToastrService
  ) {
    this.router = _router;
    this.sdk = _sdk;
    this.documents = _documents;
    console.log(this.toastr);
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
    const configuration: TextDataScannerConfiguration = {
      containerId: ScanbotSdkService.TEXTDATA_SCANNER_CONTAINER_ID,
      onTextDetected: this.onTextDetected.bind(this),
      supportedLanguages: ['eng', 'deu'],
      onError: this.textDataScannerError.bind(this),
      preferredCamera: 'camera2 0, facing back'
    };

    try {
      await this.sdk.scanTextData(configuration);
    } catch (e) {
      this.textDataScannerError(e);
      this.router.navigateByUrl("/");
    }
  }

  textDataScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
  }

  async onTextDetected(textData: TextDataScannerResult) {
    if (!textData) return;

    if (textData.validated) {
      this.sdk.setTextDataScannerDetectionStatus(true);

      await Utils.alert(textData.text);

      setTimeout(() => {
        this.sdk.setTextDataScannerDetectionStatus(false);
      }, 500);
    }
  }

  async onScanningDone() {
    this.sdk.disposeTextDataScanner();
    await this.router.navigateByUrl("/");
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ToastrService } from "ngx-toastr";
import { TextDataScannerConfiguration, TextDataScannerResult } from "scanbot-web-sdk/@types";

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
      onError: () => { },
      supportedLanguages: ['eng', 'deu']
    };

    await this.sdk.scanTextData(configuration, this.textDataScannerError.bind(this));
  }

  textDataScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    alert(e.name + ': ' + e.message);
    this.router.navigateByUrl("/");
  }

  async onTextDetected(textData: TextDataScannerResult) {
    if (!textData) return;

    if (textData.text) {
      var text = `Text: ${textData.text} | confidence: ${textData.confidence} | isValidated: ${textData.validated}`;

      this.toastr.success(text, "Detected Text!");
    }

    if (textData.validated) {
      this.sdk.setTextDataScannerDetectionStatus(true);

      alert(textData.text);

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

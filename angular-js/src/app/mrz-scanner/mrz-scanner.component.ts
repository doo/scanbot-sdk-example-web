import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ToastrService } from "ngx-toastr";
import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";
import { Utils } from "../service/utils";

@Component({
  selector: "app-mrz-scanner",
  templateUrl: "./mrz-scanner.component.html",
  styleUrls: ["./mrz-scanner.component.scss"],
})
export class MrzScannerComponent implements OnInit {
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
    const configuration = {
      containerId: ScanbotSdkService.MRZ_SCANNER_CONTAINER_ID,
      onMrzDetected: this.onMrzDetected.bind(this),
      onError: this.mrzScannerError.bind(this),
      preferredCamera: 'camera2 0, facing back'
    };

    try {
      await this.sdk.scanMrz(configuration);
    } catch (e) {
      this.mrzScannerError(e);
      this.router.navigateByUrl("/");
    }
  }

  mrzScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    Utils.alert(e.name + ': ' + e.message);
  }

  toConfidenceString(input: any, key: string): string {
    const confidence = input[key].confidence;

    if (!confidence) {
      return "";
    }
    return ` (${Number(confidence).toFixed(3)})`
  }

  parseMRZValue(input: any, key: string) {
    return input[key] ? (input[key].value + this.toConfidenceString(input, key)) : ''
  }

  async onMrzDetected(mrz: MrzResult) {
    let text = "";

    text += "Document Type: " + this.parseMRZValue(mrz, 'documentType') + "<br>";
    text += "First Name: " + this.parseMRZValue(mrz, 'givenNames') + "<br>";
    text += "Last Name: " + this.parseMRZValue(mrz, 'surname') + "<br>";
    text += "Issuing Authority: " + this.parseMRZValue(mrz, 'issuingAuthority') + "<br>";
    text += "Nationality: " + this.parseMRZValue(mrz, "nationality") + "<br>";
    text += "Birth Date: " + this.parseMRZValue(mrz, "birthDate") + "<br>";
    text += "Gender: " + this.parseMRZValue(mrz, "gender") + "<br>";
    text += "Date of Expiry: " + this.parseMRZValue(mrz, "expiryDate") + "<br>";

    this.toastr.success(text, "Detected Mrz!", { enableHtml: true });
  }

  async onScanningDone() {
    this.sdk.disposeMrzScanner();
    await this.router.navigateByUrl("/");
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ToastrService } from "ngx-toastr";
import { MrzResult } from "scanbot-web-sdk/@types/model/mrz/mrz-result";

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
    alert(e.name + ': ' + e.message);
  }

  async onMrzDetected(mrz: MrzResult) {
    let text = "";
    text =
      text +
      "Document Type: " +
      mrz.documentType?.value +
      ` (${Number(mrz.documentType?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "First Name: " +
      mrz.givenNames?.value +
      ` (${Number(mrz.givenNames?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Last Name: " +
      mrz.surname?.value +
      ` (${Number(mrz.surname?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Issuing Authority: " +
      mrz.issuingAuthority?.value +
      ` (${Number(mrz.issuingAuthority?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Nationality: " +
      mrz.nationality?.value +
      ` (${Number(mrz.nationality?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Birth Date: " +
      mrz.birthDate?.value +
      ` (${Number(mrz.birthDate?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Gender: " +
      mrz.gender?.value +
      ` (${Number(mrz.gender?.confidence).toFixed(3)})` +
      "\n";
    text =
      text +
      "Date of Expiry: " +
      mrz.expiryDate?.value +
      ` (${Number(mrz.expiryDate?.confidence).toFixed(3)})` +
      "\n";

    this.toastr.success(text, "Detected Mrz!");
  }

  async onScanningDone() {
    this.sdk.disposeMrzScanner();
    await this.router.navigateByUrl("/");
  }
}

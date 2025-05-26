import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ToastrService } from "ngx-toastr";
import { MrzScannerResult } from "scanbot-web-sdk/@types";
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

  async onMrzDetected(result: MrzScannerResult) {

    if (!result.success) {
      console.warn("Detected MRZ, but result not validated (likely frame accumulation count not satisfied).");
      return;
    }

    let text = "";

    if (result.document?.fields) {
      for (const field of result.document.fields) {
        if (field.type.commonType !== null) {
          text += `${field.type.commonType}: ${field.value?.text}<br>`;
        }
      }
    } else {
      text = JSON.stringify(result.rawMRZ);
    }

    this.toastr.success(text, "Detected Mrz!", { enableHtml: true });
  }

  async onScanningDone() {
    this.sdk.disposeMrzScanner();
    await this.router.navigateByUrl("/");
  }
}

import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentRepository} from "../service/document-repository";
import {NavigationUtils} from "../service/navigation-utils";
import {
  BarcodeResult,
  BarcodeScannerConfiguration,
} from "scanbot-web-sdk/@types";
import ViewUtils from "../service/view-utils";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss']
})
export class BarcodeScannerComponent implements OnInit {

  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  constructor(_router: Router, _sdk: ScanbotSdkService, _documents: DocumentRepository, private toastr: ToastrService) {
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
    const configuration: BarcodeScannerConfiguration = {
      onBarcodesDetected: this.onBarcodesDetected.bind(this),
      containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER_ID
    };

    await this.sdk.scanBarcodes(configuration);
  }

  async onBarcodesDetected(result: BarcodeResult) {
    this.documents.addBarcodes(result.barcodes);
    this.toastr.success(JSON.stringify(result.barcodes), 'Detected Barcodes!');
    const counter = NavigationUtils.getElementByClassName("barcode-counter");
    counter.innerText = this.documents.barcodes().length + " CODES";
  }

  async onScanningDone() {
    this.sdk.disposeBarcodeScanner();
    await this.router.navigateByUrl("/");
  }

}

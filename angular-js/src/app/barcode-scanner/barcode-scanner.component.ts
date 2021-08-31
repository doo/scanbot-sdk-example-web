import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentRepository} from "../service/document-repository";
import {NavigationUtils} from "../service/navigation-utils";
import {
  Barcode,
  BarcodeResult,
  BarcodeScannerConfiguration,
} from "scanbot-web-sdk/@types";
import {ToastrService} from "ngx-toastr";
import {BarcodeFormat} from 'scanbot-web-sdk/@types/model/barcode/barcode-format';

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
    const barcodeFormats: BarcodeFormat[] = [
      "AZTEC", 
      "CODABAR", 
      "CODE_39", 
      "CODE_93", 
      "CODE_128", 
      "DATA_MATRIX", 
      "EAN_8", 
      "EAN_13", 
      "ITF", 
      "MAXICODE", 
      "PDF_417", 
      "QR_CODE", 
      "RSS_14", 
      "RSS_EXPANDED", 
      "UPC_A", 
      "UPC_E", 
      "UPC_EAN_EXTENSION", 
      "MSI_PLESSEY"
  ];

    const configuration: BarcodeScannerConfiguration = {
      onBarcodesDetected: this.onBarcodesDetected.bind(this),
      containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER_ID,
      barcodeFormats: barcodeFormats
    };

    await this.sdk.scanBarcodes(configuration);
  }

  async onBarcodesDetected(result: BarcodeResult) {
    this.documents.addBarcodes(result.barcodes);
    this.toastr.success(this.formatBarcodes(result.barcodes), 'Detected Barcodes!');
    const counter = NavigationUtils.getElementByClassName("barcode-counter");
    counter.innerText = this.documents.barcodes().length + " CODES";
  }

  async onScanningDone() {
    this.sdk.disposeBarcodeScanner();
    await this.router.navigateByUrl("/");
  }

  formatBarcodes(codes: Barcode[]): string {
    return JSON.stringify(codes.map((code: Barcode) => code.text + " (" + code.format + ") "));
  }
}

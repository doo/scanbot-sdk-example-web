import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import {
  Barcode,
  BarcodeResult,
  BarcodeScannerConfiguration,
} from "scanbot-web-sdk/@types";
import { ToastrService } from "ngx-toastr";
import { BarcodeFormat } from "scanbot-web-sdk/@types/model/barcode/barcode-format";
import { Utils } from "../service/utils";
import { IBarcodePolygonHandle, IBarcodePolygonLabelHandle } from "scanbot-web-sdk/@types/model/configuration/selection-overlay-configuration";
import Swal from "sweetalert2";

@Component({
  selector: "app-barcode-scanner",
  templateUrl: "./barcode-scanner.component.html",
  styleUrls: ["./barcode-scanner.component.scss"],
})
export class BarcodeScannerComponent implements OnInit {
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
      "MSI_PLESSEY",
    ];


    const isOverlyScanner = this.isOverlayScanner();

    const configuration: BarcodeScannerConfiguration = {
      onBarcodesDetected: this.onBarcodesDetected.bind(this),
      containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER_ID,
      barcodeFormats,
      onError: this.barcodeScannerError.bind(this),
      preferredCamera: 'camera2 0, facing back',
      overlay: {
        visible: isOverlyScanner,
        onBarcodeFound: (code: Barcode, polygon: IBarcodePolygonHandle, label: IBarcodePolygonLabelHandle) => {
          // You can override onBarcodeFound and create your own implementation for custom styling, e.g.
          // if you wish to only color in certain types of barcodes, you can find and pick them, as demonstrated below:
          if (code.format === "QR_CODE") {
            polygon.style({ fill: "rgba(255, 255, 0, 0.3)", stroke: "yellow" })
          }
        }
      },
      showFinder: !isOverlyScanner,
    };

    try {
      await this.sdk.scanBarcodes(configuration, !isOverlyScanner);
    } catch (e) {
      this.barcodeScannerError(e);
      this.router.navigateByUrl("/");
    }
  }

  isOverlayScanner() {
    return this.router.url.includes("overlay")
  }

  barcodeScannerError(e: Error) {
    console.log(e.name + ': ' + e.message);
    Swal.fire({
      text: e.name + ': ' + e.message
    });
  }

  async onBarcodesDetected(result: BarcodeResult) {
    this.documents.addBarcodes(result.barcodes);
    this.toastr.success(Utils.formatBarcodes(result.barcodes), "Detected Barcodes!");
    const counter = NavigationUtils.getElementByClassName("barcode-counter");
    counter.innerText = this.documents.barcodes().length + " CODES";
  }

  async onScanningDone() {
    this.sdk.disposeBarcodeScanner();
    await this.router.navigateByUrl("/");
  }
}

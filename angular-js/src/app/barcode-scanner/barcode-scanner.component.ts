
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import {
  BarcodeFormat, BarcodeItem,
  BarcodeScannerConfiguration, BarcodeScannerResult, BarcodeScannerViewConfiguration,
} from "scanbot-web-sdk/@types";
import {
  IBarcodePolygonHandle,
  IBarcodePolygonLabelHandle,
} from "scanbot-web-sdk/@types/model/configuration/selection-overlay-configuration";

import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { Utils } from "../service/utils";
import ScanbotSDK from "scanbot-web-sdk/webpack";

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
      "MAXI_CODE",
      "PDF_417",
      "QR_CODE",
      "DATABAR",
      "DATABAR_EXPANDED",
      "UPC_A",
      "UPC_E",
      "MSI_PLESSEY",
      "IATA_2_OF_5",
      "INDUSTRIAL_2_OF_5",
      "CODE_25",
      "MICRO_QR_CODE",
      "USPS_INTELLIGENT_MAIL",
      "ROYAL_MAIL",
      "JAPAN_POST",
      "ROYAL_TNT_POST",
      "AUSTRALIA_POST",
      "DATABAR_LIMITED",
      "MICRO_PDF_417",
      "GS1_COMPOSITE",
      "RMQR_CODE",
      "CODE_11",
      "CODE_32",
      "PHARMA_CODE",
      "PHARMA_CODE_TWO_TRACK",
      "PZN"
    ];


    const isOverlyScanner = this.isOverlayScanner();

    const configuration: BarcodeScannerViewConfiguration = {
      onBarcodesDetected: this.onBarcodesDetected.bind(this),
      containerId: ScanbotSdkService.BARCODE_SCANNER_CONTAINER_ID,
      detectionParameters: {
        barcodeFormatConfigurations: [
          new ScanbotSDK.Config.BarcodeFormatCommonConfiguration({
            formats: barcodeFormats
          })
        ]
      },
      onError: this.barcodeScannerError.bind(this),
      preferredCamera: 'camera2 0, facing back',
      overlay: {
        visible: isOverlyScanner,
        onBarcodeFound: (code: BarcodeItem, polygon: IBarcodePolygonHandle, label: IBarcodePolygonLabelHandle) => {
          // You can override onBarcodeFound and create your own implementation for custom styling, e.g.
          // if you wish to only color in certain types of barcodes, you can find and pick them, as demonstrated below:
          if (code.format === "QR_CODE") {
            polygon?.style({ fillColor: "rgba(255, 255, 0, 0.3)", strokeColor: "yellow" });
          }
        }
      },
      finder: {
        visible: !isOverlyScanner,
        style: {
          _type: "FinderCorneredStyle",
          strokeColor: "#FF0000",
          strokeWidth: 2.0,
          cornerRadius: 10.0
        },
        overlayColor: "rgb(0, 0, 0, 0.5)",
        aspectRatio: {
          width: 1.0,
          height: 1.0
        }
      }
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
    Utils.alert(e.name + ': ' + e.message);
  }

  async onBarcodesDetected(result: BarcodeScannerResult) {
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

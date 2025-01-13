import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { NavigationUtils } from "../service/navigation-utils";
import { ImageUtils } from "../service/image-utils";
import { DocumentRepository, SBDocumentResult } from "../service/document-repository";
import { RoutePaths } from "../model/RoutePaths";
import { Utils } from "../service/utils";
import { DocumentDetectionResult } from "scanbot-web-sdk/@types";

export enum FeatureId {
  DocumentPicker,
  BarcodePicker,
  License,
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  features: any = [
    { route: RoutePaths.DocumentScanner, name: "Scan Documents" },
    { route: RoutePaths.BarcodeScanner, name: "Scan Barcodes" },
    { route: RoutePaths.BarcodeScannerWithOverlay, name: "Scan Barcodes with AR overlay" },
    { route: RoutePaths.MrzScanner, name: "Scan MRZ" },
    { route: RoutePaths.TextDataScanner, name: "Text Data Scanner" },
    { id: FeatureId.DocumentPicker, name: "Pick Document image" },
    { id: FeatureId.BarcodePicker, name: "Pick Barcode image" },
    { route: RoutePaths.ImageResults, name: "Document Results" },
    { id: FeatureId.License, name: "Check License" },
  ];

  constructor(
    _router: Router,
    _sdk: ScanbotSdkService,
    _repository: DocumentRepository,
  ) {
    this.router = _router;
    this.sdk = _sdk;
    this.documents = _repository;
  }

  ngOnInit(): void {
    NavigationUtils.showBackButton(false);
    NavigationUtils.showCameraSwapButton(false);
    NavigationUtils.showCameraSwitchButton(false);
  }

  async onItemClick(e) {
    if (e.route) {
      await this.router.navigateByUrl(e.route);
      return;
    }

    if (e.id === FeatureId.DocumentPicker) {
      const image = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG);

      const result = await this.sdk.detectDocument(image.original);
      if (result.status.startsWith('OK') === true && result.pointsNormalized) {
        const cropped = await this.sdk.cropAndRotateImageCcw(image.original, result.pointsNormalized, 0);
        const document: SBDocumentResult = { ...result, originalImage: image.original, croppedImage: cropped };
        this.documents.add(document);
        await Utils.alert("Detection successful");
      } else {
        await Utils.alert("Detection failed");
      }
    }

    if (e.id === FeatureId.BarcodePicker) {
      const result = await ImageUtils.pick(ImageUtils.MIME_TYPE_JPEG);
      console.log('result', result);

      const detection = await this.sdk?.detectBarcodes(
        result.original
      );
      if (detection !== undefined) {
        await Utils.alert(Utils.formatBarcodes(detection.barcodes));
      }
    }

    if (e.id === FeatureId.License) {
      await Utils.alertHtml(`<h3>License Info</h3><p>${await this.sdk.licenseInfoString()}</p>`);
    }
  }
}

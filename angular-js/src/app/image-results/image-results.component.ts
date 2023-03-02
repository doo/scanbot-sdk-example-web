import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { ImageUtils } from "../service/image-utils";
import { Utils } from "../service/utils";
import { RoutePaths } from "../model/RoutePaths";

@Component({
  selector: "app-image-results",
  templateUrl: "./image-results.component.html",
  styleUrls: ["./image-results.component.scss"],
})
export class ImageResultsComponent implements OnInit {
  documents: any[];

  router: Router;
  sdk: ScanbotSdkService;
  repository: DocumentRepository;

  constructor(
    _router: Router,
    _sdk: ScanbotSdkService,
    _documents: DocumentRepository
  ) {
    this.router = _router;
    this.sdk = _sdk;
    this.repository = _documents;

    this.documents = [];
  }

  async ngOnInit(): Promise<void> {
    NavigationUtils.showBackButton(true);

    const pages = this.repository.getPages();
    if (pages.length > 0) {
      NavigationUtils.getElementByClassName(
        "nothing-to-display-hint"
      ).style.display = "none";
    }

    let i = 0;
    for (const page of pages) {
      console.log("page", page);
      this.documents.push({ image: await this.sdk.toDataUrl(page), index: i });
      i++;
    }
  }

  async savePDF() {
    const bytes = await this.sdk.generatePDF(this.repository.getPages());
    ImageUtils.saveBytes(bytes, Utils.generateUUID() + ".pdf");
  }

  async saveTIFF() {
    const bytes = await this.sdk.generateTIFF(this.repository.getPages());
    ImageUtils.saveBytes(bytes, Utils.generateUUID() + ".tiff");
  }

  async onImageClick(document: any) {
    this.repository.setActiveItem(document.index);
    await this.router.navigateByUrl(RoutePaths.ImageDetails);
  }

  async onBack() {
    await this.router.navigateByUrl('/');
  }
}

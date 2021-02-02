import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentRepository} from "../service/document-repository";
import {NavigationUtils} from "../service/navigation-utils";
import {RoutePaths} from "../app-routing.module";
import Swal from "sweetalert2";
import {ImageFilter} from "scanbot-web-sdk/@types/model/filter-types";

@Component({
  selector: 'app-image-details',
  templateUrl: './image-details.component.html',
  styleUrls: ['./image-details.component.scss']
})
export class ImageDetailsComponent implements OnInit {

  image: any;

  router: Router;
  sdk: ScanbotSdkService;
  repository: DocumentRepository;

  constructor(_router: Router, _sdk: ScanbotSdkService, _documents: DocumentRepository) {
    this.router = _router;
    this.sdk = _sdk;
    this.repository = _documents;
  }


  async ngOnInit(): Promise<void> {
    NavigationUtils.showBackButton(true);

    if (!this.sdk.isReady()) {
      this.sdk.onReady = () => {
        this.loadImage();
      }
    } else {
      this.loadImage();
    }
  }

  async loadImage() {
    if (!this.repository.getActiveItem()) {
      NavigationUtils.getElementByClassName("detail-image").style.display = "none";
      NavigationUtils.getElementByClassName("nothing-to-display-hint").style.display = "block";
    } else {
      this.image = await this.sdk.toDataUrl(this.repository.getActiveItem());
    }
  }

  async openCroppingView() {
    await this.router.navigateByUrl(RoutePaths.Cropping);
  }

  async applyFilter() {
    const result = await Swal.fire({
      title: 'Select filter',
      input: 'select',
      inputOptions: this.sdk.availableFilters(),
      inputPlaceholder: this.repository.getActiveItem().filter ?? "none"
    });

    const filter = this.sdk.filterByIndex(result.value);

    if (filter === "none") {
      this.repository.getActiveItem().filter = undefined;
      this.repository.getActiveItem().filtered = undefined;
    } else {
      this.repository.getActiveItem().filter = filter;
      const image = this.repository.getActiveItem().cropped ?? this.repository.getActiveItem().original;
      this.repository.getActiveItem().filtered = await this.sdk.applyFilter(image, filter as ImageFilter);
    }

    await this.loadImage();
  }
}

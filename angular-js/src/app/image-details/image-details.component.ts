import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {DocumentRepository} from "../service/document-repository";
import {NavigationUtils} from "../service/navigation-utils";

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

  openCroppingView() {

  }

  applyFilter() {

  }
}

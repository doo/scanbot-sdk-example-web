import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { ScanbotSdkService } from "../service/scanbot-sdk-service";
import { DocumentRepository } from "../service/document-repository";
import { NavigationUtils } from "../service/navigation-utils";
import { RoutePaths } from "../model/RoutePaths";

@Component({
  selector: "app-cropping",
  templateUrl: "./cropping.component.html",
  styleUrls: ["./cropping.component.scss"],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class CroppingComponent implements OnInit {
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
  }

  async ngOnInit(): Promise<void> {
    NavigationUtils.showBackButton(true);
    if (!this.sdk.isReady()) {
      this.sdk.onReady = () => {
        this.openCroppingView();
      };
    } else {
      this.openCroppingView();
    }
  }

  async openCroppingView() {
    if (!this.repository.hasActiveItem()) {
      console.log("No active item, returning to Home");
      await this.router.navigateByUrl(RoutePaths.Home);
      return;
    }

    /**
     * If you're using ViewEncapsulation.ShadowDom, providing 'containerId' will not work, as it's not accessible using conventional methods.
     * In this case, it's required that you provide the container property directly, by accessing the shadowRoot yourself, as shown below.
     */
    const shadow = document.querySelector("app-cropping").shadowRoot;
    const container = shadow.getElementById("cropping-view-container");

    const options = {
      container: container,
      image: this.repository.getActiveItem().original,
      polygon: this.repository.getActiveItem().polygon,
      disableScroll: true,
      rotations: this.repository.getActiveItem().rotations ?? 0,
      style: {
        padding: 20,
        polygon: {
          color: "green",
          width: 4,
          handles: {
            size: 14,
            color: "white",
            border: "1px solid lightgray",
          },
        },
        magneticLines: {
          // disabled: true,
          color: "red",
        },
      },
    };
    await this.sdk.crop(options);
  }

  async onDetectClick() {
    await this.sdk.detectInCropper();
  }

  async onRotateClick() {
    await this.sdk.rotateInCropper();
  }

  async onApplyClick() {
    const result = await this.sdk.applyCrop();
    this.repository.updateActiveItem(
      result.image,
      result.polygon,
      result.rotations
    );
    await this.router.navigateByUrl(RoutePaths.ImageDetails);
  }

  async ngOnDestroy() {
    this.sdk.disposeCroppingView();
  }
}

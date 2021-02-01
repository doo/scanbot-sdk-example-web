import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {RoutePaths} from "../app-routing.module";
import {ScanbotSdkService} from "../service/scanbot-sdk-service";
import {NavigationUtils} from "../service/navigation-utils";
import {ImageUtils} from "../service/image-utils";
import {DocumentRepository} from "../service/document-repository";

export enum FeatureId {
  Picker,
  License
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  router: Router;
  sdk: ScanbotSdkService;
  documents: DocumentRepository;

  features: any = [
    {route: RoutePaths.DocumentScanner, name: "Scan Documents"},
    {id: FeatureId.Picker, name: "Pick image"},
    {route: RoutePaths.ImageResults, name: "Image Results"},
    {id: FeatureId.License, name: "Check License"}
  ];

  constructor(_router: Router, _sdk: ScanbotSdkService, _repository: DocumentRepository) {
    this.router = _router;
    this.sdk = _sdk;
    this.documents = _repository;
  }

  ngOnInit(): void {
    NavigationUtils.showBackButton(false);
  }

  async onItemClick(e) {
    if (e.route) {
      await this.router.navigateByUrl(e.route);
      return;
    }

    if (e.id === FeatureId.Picker) {
      const result = await ImageUtils.pick();
      this.documents.add(result);
    }
  }
}

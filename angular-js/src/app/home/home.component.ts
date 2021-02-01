import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {RoutePaths} from "../app-routing.module";
import ScanbotSDK from "scanbot-web-sdk/webpack";
import {ScanbotSDKService} from "../service/ScanbotSDKService";

export enum FeatureId {
  Scanner,
  Picker,
  Results,
  License
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  router: Router;

  features: any = [
    { route: RoutePaths.DocumentScanner, name: "Scan Documents"},
    { id: FeatureId.Picker,  name: "Pick image"},
    { id: FeatureId.Results, name: "Image Results"},
    { id: FeatureId.License, name: "Check License"}
  ];

  constructor(_router: Router, sdk: ScanbotSDKService) {
    this.router = _router;
  }

  ngOnInit(): void {
  }

  async onItemClick(e) {
    if (e.route) {
      await this.router.navigateByUrl(e.route);
      return;
    }


    switch (e.id) {
      case FeatureId.Scanner:
        console.log("start scanner");
        break;
      case FeatureId.Picker:
        console.log("pick image");
        break;
      case FeatureId.Results:
        console.log("results");
        break;
      case FeatureId.License:
        console.log("license");
        break;
      default:
        console.error("Unknown feature")
    }
  }
}

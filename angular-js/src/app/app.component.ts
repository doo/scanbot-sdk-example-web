import {Component} from "@angular/core";

import {Router} from "@angular/router";
import {ScanbotSdkService} from "./service/scanbot-sdk-service";
import {NavigationUtils} from "./service/navigation-utils";
import {RoutePaths} from "./app-routing.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  SDK: ScanbotSdkService;

  router: Router;

  constructor(_router: Router, _sdk: ScanbotSdkService) {
    this.router = _router;
    this.SDK = _sdk;
  }
  async onBackButtonClick() {

    if (NavigationUtils.isAtPath(RoutePaths.DocumentScanner)) {
      this.SDK.disposeScanner();
    }
    await this.router.navigateByUrl("/");
  }
}

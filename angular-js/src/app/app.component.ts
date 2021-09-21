import {Component} from '@angular/core';

import {Router} from '@angular/router';
import {ScanbotSdkService} from './service/scanbot-sdk-service';
import {NavigationUtils} from './service/navigation-utils';
import {RoutePaths} from './model/RoutePaths';

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

    let destination = '/';
    if (NavigationUtils.isAtPath(RoutePaths.DocumentScanner)) {
      this.SDK.disposeDocumentScanner();
    }

    if (NavigationUtils.isAtPath(RoutePaths.BarcodeScanner)) {
      this.SDK.disposeBarcodeScanner();
    }

    if (NavigationUtils.isAtPath(RoutePaths.MrzScanner)) {
      this.SDK.disposeMrzScanner();
    }

    if (NavigationUtils.isAtPath(RoutePaths.ImageDetails)) {
      destination = RoutePaths.ImageResults;
    }

    if (NavigationUtils.isAtPath(RoutePaths.Cropping)) {
      destination = RoutePaths.ImageDetails;
    }

    await this.router.navigateByUrl(destination);
  }
}

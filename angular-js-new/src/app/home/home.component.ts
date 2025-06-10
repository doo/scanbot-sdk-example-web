import { Component, inject } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {

  scanbotSDK = inject(ScanbotService);
  private toastService = inject(ToastService);

  constructor() {
    this.scanbotSDK.init().then(() => {
      console.log('Scanbot SDK initialized successfully');
    });
  }

  async  getLicenseInfo() {
    const sdk = await this.scanbotSDK.getSdk();
    const licenseInfo = await sdk.getLicenseInfo();
    const message = `${licenseInfo.status}: ${licenseInfo.licenseStatusMessage}\n`;
    console.log("license info:", licenseInfo);
    this.toastService.showToast(message);
  }
}

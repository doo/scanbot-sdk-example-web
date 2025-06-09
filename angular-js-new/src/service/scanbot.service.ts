import { Injectable } from '@angular/core';
import ScanbotSDK from 'scanbot-web-sdk';

@Injectable({ providedIn: 'root', })
export class ScanbotService {

  /*
    * TODO add the license key here.
    * Please note: The Scanbot Web SDK has, without a license key, a trial period for one minute per session!
    * You can get a free "no-strings-attached" trial license if you submit the form at: https://scanbot.io/trial/
    * using "Web SDK" as the license type and the domain name of your test environment (e.g. myapp.example.com or www.mywebsite.com).
    * Every trial license automatically includes "localhost" as a domain name for local development purposes.
    */
  readonly license = "";

  private sdk?: ScanbotSDK;

  constructor() { }

  async init(): Promise<void> {
    if (!this.sdk) {
      this.sdk = await ScanbotSDK.initialize({
        licenseKey: this.license,
        enginePath: './wasm/',
      });
    }
  }

}

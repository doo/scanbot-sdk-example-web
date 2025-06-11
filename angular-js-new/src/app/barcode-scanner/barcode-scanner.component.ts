import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { BarcodeScannerViewConfiguration, IBarcodeScannerHandle } from 'scanbot-web-sdk/@types';

const CONTAINER_ID = 'barcode-scanner-container';

@Component({
  selector: 'app-document-scanner',
  template: `
    <div class="scanner-container" id=${CONTAINER_ID}></div>`,
  styles: `:host {
    height: 100%;
  }`
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {

  service = inject(ScanbotService);
  handle?: IBarcodeScannerHandle;

  async ngOnInit() {

    const sdk = await this.service.getSdk();

    const config: BarcodeScannerViewConfiguration = { containerId: CONTAINER_ID };
    this.handle = await sdk.createBarcodeScanner(config);
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

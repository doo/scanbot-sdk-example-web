import { Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { BarcodeScannerViewConfiguration, IBarcodeScannerHandle } from 'scanbot-web-sdk/@types';

const CONTAINER_ID = 'barcode-scanner-container';

@Component({
  selector: 'app-barcode-scanner',
  template: `
    <div class="scanner-container" id=${CONTAINER_ID}></div>`,
  styles: `:host {
    height: 100%;
  }`,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class BarcodeScannerComponent implements OnInit, OnDestroy {

  service = inject(ScanbotService);
  handle?: IBarcodeScannerHandle;

  async ngOnInit() {

    /**
     * If you're using ViewEncapsulation.ShadowDom, providing 'containerId' will not work,
     * as it's not accessible using conventional methods. In this case, it's required that you provide
     * the container property directly, by accessing the shadowRoot yourself, as shown below.
     */
    const shadow = document.querySelector("app-barcode-scanner")?.shadowRoot;
    const container = shadow?.getElementById(CONTAINER_ID);

    if (!container) {
      console.error(`Container with ID '${CONTAINER_ID}' not found in the shadow DOM.`);
      return;
    }

    container.style.height = '100%';
    const sdk = await this.service.getSdk();

    const config: BarcodeScannerViewConfiguration = { container: container as HTMLElement };
    this.handle = await sdk.createBarcodeScanner(config);
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

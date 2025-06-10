import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { DocumentScannerViewConfiguration, IDocumentScannerHandle } from 'scanbot-web-sdk/@types';
import { RouterLink } from '@angular/router';

const CONTAINER_ID = 'document-scanner-container';

@Component({
  selector: 'app-document-scanner',
  imports: [RouterLink],
  template: `
    <div class="scanner-container" id=${CONTAINER_ID}></div>`,
  styles: `:host {
    height: 100%;
  }`
})
export class DocumentScannerComponent implements OnInit, OnDestroy {

  service = inject(ScanbotService);
  handle?: IDocumentScannerHandle;

  async ngOnInit() {

    const sdk = await this.service.getSdk();

    const config: DocumentScannerViewConfiguration = { containerId: CONTAINER_ID };
    this.handle = await sdk.createDocumentScanner(config);
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

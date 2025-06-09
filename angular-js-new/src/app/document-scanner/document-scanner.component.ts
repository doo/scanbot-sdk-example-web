import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { DocumentScannerViewConfiguration, IDocumentScannerHandle } from 'scanbot-web-sdk/@types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-document-scanner',
  imports: [RouterLink],
  template: `
    <div class="scanner-container" id="document-scanner-container"></div>`,
  styles: `:host {
    height: 100%;
  }`
})
export class DocumentScannerComponent implements OnInit, OnDestroy {

  service = inject(ScanbotService);
  handle?: IDocumentScannerHandle;

  async ngOnInit() {

    const sdk = await this.service.getSdk();
    const config: DocumentScannerViewConfiguration = {
      containerId: 'document-scanner-container'
    };
    
    sdk.createDocumentScanner(config).then((scanner) => {
      this.handle = scanner;
    });
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

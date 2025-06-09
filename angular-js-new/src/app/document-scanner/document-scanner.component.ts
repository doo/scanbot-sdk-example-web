import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { DocumentScannerViewConfiguration, IDocumentScannerHandle } from 'scanbot-web-sdk/@types';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-document-scanner',
  imports: [
    RouterLink
  ],
  templateUrl: './document-scanner.component.html',
  styleUrl: './document-scanner.component.css'
})
export class DocumentScannerComponent implements OnInit, OnDestroy {

  service = inject(ScanbotService);

  handle?: IDocumentScannerHandle;

  async ngOnInit() {
    console.log('Document Scanner Component OnInit');
    const container = document.getElementById('document-scanner-container');
    console.log('Container Element:', container);
    const sdk = await this.service.getSdk();

    const config: DocumentScannerViewConfiguration = {
      containerId: 'document-scanner-container', // The ID of the HTML element where the scanner will be rendered
    };
    sdk.createDocumentScanner(config).then((scanner) => {
      console.log('Document Scanner created successfully:', scanner);
      this.handle = scanner;
    });
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

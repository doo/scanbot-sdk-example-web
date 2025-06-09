import { Component, inject } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { DocumentScannerViewConfiguration } from 'scanbot-web-sdk/@types';

@Component({
  selector: 'app-document-scanner',
  imports: [],
  templateUrl: './document-scanner.component.html',
  styleUrl: './document-scanner.component.css'
})
export class DocumentScannerComponent {

  service = inject(ScanbotService);

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
    });
  }
}

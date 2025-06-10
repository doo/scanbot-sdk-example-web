import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import { DocumentScannerViewConfiguration, IDocumentScannerHandle } from 'scanbot-web-sdk/@types';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../service/toast.service';

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

  private scanbot = inject(ScanbotService);
  private toast = inject(ToastService);

  handle?: IDocumentScannerHandle;

  async ngOnInit() {

    const sdk = await this.scanbot.getSdk();

    const config: DocumentScannerViewConfiguration = {
      containerId: CONTAINER_ID,
      onDocumentDetected: (response) => {
        const result = response.result.detectionResult;
        console.log('Document detected:', result);

        let message = ``;

        if (result.status === "ERROR_NOTHING_DETECTED") {
          message = 'No document detected.';
        } else {
          message = "Detected document with ... todo additional processing"
        }

        sdk.storage.storeCroppedDetectionResult(response).then((id) => {
          console.log("Detection result stored with ID:", id);
        });
        this.toast.show(message);
      }
    };
    this.handle = await sdk.createDocumentScanner(config);
  }

  ngOnDestroy() {
    this.handle?.dispose();
  }
}

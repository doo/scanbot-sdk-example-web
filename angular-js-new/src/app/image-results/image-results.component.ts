import { Component, inject, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import ScanbotSDK from 'scanbot-web-sdk';
import { DocumentDetectionResult, DocumentScanningResult, Image } from 'scanbot-web-sdk/@types';
import { ToastService } from '../../service/toast.service';

class DisplayImage {
  source?: Image;
  base64?: string;
  detectionResult?: DocumentDetectionResult;
}

@Component({
  selector: 'app-image-results',
  templateUrl: './image-results.component.html',
})
export class ImageResultsComponent implements OnInit {

  private scanbot = inject(ScanbotService);
  private toast = inject(ToastService);

  images: DisplayImage[] = [];

  async ngOnInit() {
    const sdk = await this.scanbot.getSdk();
    const results = await sdk.storage.getCroppedDetectionResults(false);
    console.log("Cropped detection results:", results);

    results.forEach((item) => {

      sdk.storage.getCroppedDetectionResultImage(item.id).then(async (images) => {
        if (images && images.length > 0) {
          const original = images.find(i => i.documentId === item.id && i.type === "original");
          const cropped = images.find(i => i.documentId === item.id && i.type === "cropped");

          let image: DisplayImage = new DisplayImage();
          if (cropped) {
            image.source = ScanbotSDK.Config.Image.fromWrappedImage(cropped.data);
          } else {
            image.source = ScanbotSDK.Config.Image.fromWrappedImage(original!.data);
          }
          const jpeg = await image.source.toJpeg();
          image.base64 = await this.toDataUrl(jpeg);
          image.detectionResult = item.result.detectionResult;

          this.images.push(image);
        } else {
          console.warn("No images found for item:", item.id);
        }
      });
    });
  }

  toDataUrl(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  onImageClick(image: DisplayImage) {
    const scores = image.detectionResult?.detectionScores;
    this.toast.show(JSON.stringify(scores));
  }
}

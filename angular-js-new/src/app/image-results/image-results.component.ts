import { Component, inject, OnInit } from '@angular/core';
import { ScanbotService } from '../../service/scanbot.service';
import ScanbotSDK from 'scanbot-web-sdk';
import { Image } from 'scanbot-web-sdk/@types';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image-results',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './image-results.component.html',
  styleUrl: './image-results.component.css'
})
export class ImageResultsComponent implements OnInit {

  private scanbot = inject(ScanbotService);

  IMAGES: string[] = [];

  async ngOnInit() {
    const sdk = await this.scanbot.getSdk();
    const results = await sdk.storage.getCroppedDetectionResults(false);
    console.log("Cropped detection results:", results);

    results.forEach((item) => {
      sdk.storage.getCroppedDetectionResultImage(item.id).then(async (images) => {
        if (images && images.length > 0) {
          const original = images.find(i => i.documentId === item.id && i.type === "original");
          const cropped = images.find(i => i.documentId === item.id && i.type === "cropped");

          let image: Image;
          if (cropped) {
            image = ScanbotSDK.Config.Image.fromWrappedImage(cropped.data);
          } else {
            image = ScanbotSDK.Config.Image.fromWrappedImage(original!.data);
          }
          const jpeg = await image.toJpeg();
          const base64 = await this.toDataUrl(jpeg);
          this.IMAGES.push(base64);
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
}

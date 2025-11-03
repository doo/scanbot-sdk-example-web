import type ScanbotSDK from "scanbot-web-sdk";
import type { Image, Polygon } from "scanbot-web-sdk/@types";
import { Filters } from "@/misc/Filters";
import { toRaw } from "vue";


export interface DocumentContent {
  filtered?: Image,
  cropped?: Image,
  original: Image,
  polygon?: Polygon,
  rotations?: number,
  filter?: typeof Filters.availableFilters[number]
}

export type ScanbotDocument = {
  content: DocumentContent,
  id: number,
  dataUrl?: string
};

export class DocumentStore {

  static instance = new DocumentStore();

  documents: ScanbotDocument[] = [];
  nextId = 0;

  addDocument(document: DocumentContent) {
    this.documents.push({ id: this.nextId++, content: document });
    console.log(document);
  }

  async updateDataUrls(scanbotSDK: ScanbotSDK) {
    for (const document of this.documents) {
      await this.updateDataUrl(document as ScanbotDocument, scanbotSDK);
    }
  }

  async updateDataUrl(document: ScanbotDocument, scanbotSDK: ScanbotSDK) {
    const image = document.content.filtered ?? document.content.cropped ?? document.content.original;
    const jpeg = await scanbotSDK.imageToJpeg(image);
    document.dataUrl = await scanbotSDK.toDataUrl(jpeg.slice().buffer);
  }

  removeDocument(document: ScanbotDocument) {
    const index = this.documents.indexOf(document);
    if (index > -1) {
      this.documents.splice(index, 1);
    }
  }

  getDocumentById(id: number): ScanbotDocument | undefined {
    return toRaw(this.documents.find(document => document.id === id)) as ScanbotDocument;
  }

}
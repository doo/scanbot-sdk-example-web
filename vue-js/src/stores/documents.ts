import {defineStore} from 'pinia'
import type ScanbotSDK from "scanbot-web-sdk";
import type { Image, Polygon } from "scanbot-web-sdk/@types";
import { Filters } from "@/misc/Filters";
import { toRaw } from "vue";

export type DocumentContent = {
  filtered?: Image,
  cropped?: Image,
  original: Image,
  polygon?: Polygon,
  rotations?: number,
  filter?: typeof Filters.availableFilters[number]
}

export type Document = {
  content: DocumentContent,
  id: number,
  dataUrl?: string
};

export const useDocumentsStore = defineStore('documents', {
    state: () => ({
        documents: [] as Document[],
        nextId: 0,
    }),
    actions: {
        addDocument(document: DocumentContent) {
            this.documents.push({id: this.nextId++, content: document});
            console.log(document);
        },
        async updateDataUrls(scanbotSDK: ScanbotSDK) {
            for (const document of this.documents) {
                await this.updateDataUrl(document as Document, scanbotSDK);
            }
        },
        async updateDataUrl(document: Document, scanbotSDK: ScanbotSDK) {
            document.dataUrl = await scanbotSDK.toDataUrl(
              await scanbotSDK.imageToJpeg(
                toRaw(document.content.filtered ?? document.content.cropped ?? document.content.original)
              )
            );
        },
        removeDocument(document: Document) {
            const index = this.documents.indexOf(document);
            if (index > -1) {
                this.documents.splice(index, 1);
            }
        },
        getDocumentById(id: number): Document | undefined {
            return toRaw(this.documents.find(document => document.id === id)) as Document;
        }
    },
})
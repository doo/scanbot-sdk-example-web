import {defineStore} from 'pinia'
import type ScanbotSDK from "scanbot-web-sdk";

export type Document = { content: any, id: number, dataUrl?: string };
export const useDocumentsStore = defineStore('documents', {
    state: () => ({
        documents: [] as Document[],
        nextId: 0,
    }),
    actions: {
        addDocument(document: any) {
            this.documents.push({id: this.nextId++, content: document});
            console.log(document);
        },
        async updateDataUrls(scanbotSDK: ScanbotSDK) {
            for (const document of this.documents) {
                await this.updateDataUrl(document, scanbotSDK);
            }
        },
        async updateDataUrl(document: Document, scanbotSDK: ScanbotSDK) {
            document.dataUrl = await scanbotSDK.toDataUrl(
                document.content.filtered ?? document.content.cropped ?? document.content.original
            );
        },
        removeDocument(document: Document) {
            const index = this.documents.indexOf(document);
            if (index > -1) {
                this.documents.splice(index, 1);
            }
        },
        getDocumentById(id: number): Document | undefined {
            return this.documents.find(document => document.id === id);
        }
    },
})
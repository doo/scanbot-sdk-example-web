import type { ScanbotDocument } from "./scanbot-sdk-service";

export default class StorageService {

    private static readonly DOCUMENT_PREFIX = "scanbot-document-";
    public static readonly INSTANCE = new StorageService();

    public storeDocument(document: ScanbotDocument) {
        this.set(StorageService.DOCUMENT_PREFIX + document.id, JSON.stringify(document));
        return document;
    }

    public getDocuments(): ScanbotDocument[] {
        const list: ScanbotDocument[] = [];

        const items = { ...localStorage };
        for (const key in items) {
            if (key.startsWith(StorageService.DOCUMENT_PREFIX)) {
                const value = items[key];
                const document: ScanbotDocument = JSON.parse(value);
                list.push(document);
            }
        }
        return list;
    }

    private set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private get(key: string): string | null {
        return localStorage.getItem(key);
    }
}
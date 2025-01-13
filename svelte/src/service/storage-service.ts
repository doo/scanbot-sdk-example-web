import Codec from "./codec";
import type { ScanbotDocument } from "./scanbot-sdk-service";

export default class StorageService {

    private static readonly DOCUMENT_PREFIX = "scanbot-document-";

    public static readonly INSTANCE = new StorageService();

    public async storeDocument(document: ScanbotDocument) {
        /** Do not modify original document, create a copy to store. We don't want to encode bytes on items already in memory */
        this.set(StorageService.DOCUMENT_PREFIX + document.id, JSON.stringify({
            id: document.id,
            base64: document.base64,
            original: await Codec.encodeBytes(document.original),
            cropped: await Codec.encodeBytes(document.cropped),
            polygon: document.polygon,
            rotations: document.rotations
        }));
        return document;
    }

    public async getDocuments(): Promise<ScanbotDocument[]> {
        const list: ScanbotDocument[] = [];

        const items = { ...localStorage };
        for (const key in items) {
            if (key.startsWith(StorageService.DOCUMENT_PREFIX)) {
                const value = items[key];
                const document: ScanbotDocument = JSON.parse(value);
                document.original = await Codec.decodeBytes(document.original as any as string);
                if (document.cropped) {
                    document.cropped = await Codec.decodeBytes(document.cropped as any as string);
                }


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
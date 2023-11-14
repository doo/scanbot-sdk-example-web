import type { ScanbotDocument } from "./scanbot-sdk-service";

export default class StorageService {

    private static readonly TYPE_PREFIX = "data:image/jpeg;base64,";
    private static readonly DOCUMENT_PREFIX = "scanbot-document-";

    public static readonly INSTANCE = new StorageService();

    public async storeDocument(document: ScanbotDocument) {
        /** Do not modify original document, create a copy to store. We don't want to encode bytes on items already in memory */
        this.set(StorageService.DOCUMENT_PREFIX + document.id, JSON.stringify({
            id: document.id,
            base64: document.base64,
            original: await this.encodeBytes(document.original),
            cropped: await this.encodeBytes(document.cropped),
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
                document.original = await this.decodeBytes(document.original as string);
                if (document.cropped) {
                    document.cropped = await this.decodeBytes(document.cropped as string);
                }


                list.push(document);
            }
        }
        return list;
    }

    async encodeBytes(bytes: Uint8Array | string | undefined): Promise<string> {

        if (!bytes) {
            return "";
        }

        const base64url = await new Promise<string | ArrayBuffer | null>((r) => {
            const reader = new FileReader()
            reader.onload = () => r(reader.result)
            // const blob = new Blob([buffer], {type:'application/octet-binary'});    

            reader.readAsDataURL(new Blob([bytes], { type: 'image/jpeg' }));
        })

        if (!base64url || typeof base64url !== "string") {
            return "";
        }

        return base64url.replace(StorageService.TYPE_PREFIX, "");
    }

    async decodeBytes(bytes: string): Promise<Uint8Array> {

        const dataUrl = StorageService.TYPE_PREFIX + bytes;

        const response = await fetch(dataUrl);
        const buffer = await response.arrayBuffer();

        return new Uint8Array(buffer);
    }

    private set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private get(key: string): string | null {
        return localStorage.getItem(key);
    }
}
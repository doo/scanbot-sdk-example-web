import type { ScanbotDocument } from "./scanbot-sdk-service";

export default class StorageService {

    private static readonly DOCUMENT_PREFIX = "scanbot-document-";
    public static readonly INSTANCE = new StorageService();

    public async storeDocument(document: ScanbotDocument) {
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

    tryParseByteArray(str: string): Uint8Array | undefined {
        try {
            return new Uint8Array(JSON.parse(str));
        } catch (error) {
            return undefined;
        }
    }

    async encodeBytes(bytes: Uint8Array | string | undefined): Promise<string> {

        if (!bytes) {
            return "";
        }

        const base64url: string | null = await new Promise((r) => {
            const reader = new FileReader()
            reader.onload = () => r(reader.result)
            // const blob = new Blob([buffer], {type:'application/octet-binary'});    

            reader.readAsDataURL(new Blob([bytes], { type: 'image/jpeg' }));
        })

        /*
        The result looks like "data:application/octet-stream;base64,<your base64 data>", split off the beginning:
        */
        if (!base64url) {
            return "";
        }

        return base64url.split(",", 2)[1];
    }

    async decodeBytes(bytes: string): Promise<Uint8Array> {

        const dataUrl = "data:image/jpeg;base64," + bytes;

        const response = await fetch(dataUrl);
        const buffer = await response.arrayBuffer();
        console.log("buffer", buffer);
        return new Uint8Array(buffer);

        //   .then(res => res.arrayBuffer())
        //   .then(buffer => {
        //     console.log("base64 to buffer: " + new Uint8Array(buffer));
        //   });

        // const padding = '='.repeat((4 - bytes.length % 4) % 4);
        // const base64 = (bytes + padding)
        //     .replace(/\-/g, '+')
        //     .replace(/_/g, '/');

        const rawData = window.atob(bytes);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    private set(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    private get(key: string): string | null {
        return localStorage.getItem(key);
    }
}
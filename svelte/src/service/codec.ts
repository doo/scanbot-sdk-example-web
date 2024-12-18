/**
 * Used to encode Uint8Array to base64 and vice versa. 
 * This necessary in order to effectively store our scanned pages in localStorage.
 */
export default class Codec {

    private static readonly TYPE_PREFIX = "data:image/jpeg;base64,";

    static async encodeBytes(bytes: ArrayBuffer | string | undefined): Promise<string> {

        if (!bytes) {
            return "";
        }

        const base64url = await new Promise<string | ArrayBuffer | null>((r) => {
            const reader = new FileReader()
            reader.onload = () => r(reader.result)
            reader.readAsDataURL(new Blob([bytes], { type: 'image/jpeg' }));
        })

        if (!base64url || typeof base64url !== "string") {
            return "";
        }

        return base64url.replace(Codec.TYPE_PREFIX, "");
    }

    static async decodeBytes(bytes: string): Promise<Uint8Array> {

        const dataUrl = Codec.TYPE_PREFIX + bytes;

        const response = await fetch(dataUrl);
        const buffer = await response.arrayBuffer();

        return new Uint8Array(buffer);
    }

}
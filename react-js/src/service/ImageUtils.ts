import { Image, PdfPageOptions, RawImage, SBStoreCroppedDetectionResult, SBStoreImage } from "scanbot-web-sdk/@types";
import SBSDKService from "./SBSDKService";

export enum MimeType {
    Jpeg = "image/jpeg"
}

export default class ImageUtils {

    public static pick(mime: MimeType): Promise<Uint8Array> {
        return new Promise<Uint8Array>((resolve) => {
            let picker = document.getElementById("picker") as HTMLInputElement;

            if (!picker) {
                picker = document.createElement("input") as HTMLInputElement;
                document.body.appendChild(picker);
                picker.id = "picker";
                picker.type = "file";
                picker.accept = mime;

            }
            picker.click();

            picker.onchange = (e) => {
                e.preventDefault();
                const reader = new FileReader();

                const files = picker?.files;
                if (!files) {
                    return;
                }

                reader.readAsArrayBuffer(files[0]);

                reader.onload = async (e) => {
                    console.log("reader.onload", e, reader.result);
                    const result = reader.result;
                    if (result instanceof ArrayBuffer) {
                        resolve(new Uint8Array(result));
                        picker.remove();
                    } else {
                        console.error("Invalid reader result", result);
                    }
                };
            };
        });
    }

    static createBase64Image(item: SBStoreCroppedDetectionResult, images?: SBStoreImage[]): Promise<string> {
        return new Promise((resolve) => {
            const original = images ? images.find(i => i.documentId === item.id && i.type === "original")?.data : item.originalImage;
            const cropped = images ? images.find(i => i.documentId === item.id && i.type === "cropped")?.data as RawImage : item.croppedImage;

            if (cropped) {
                const base64 = this.rawImageToBase64(cropped);
                resolve(base64);
            } else if (original) {
                const canvas = ImageUtils.createImageDataCanvas(original as ImageData);
                const base64 = canvas.toDataURL("image/png");
                resolve(base64);
            }
        });
    }

    static rawImageToBase64(item: Image): Promise<string> {
        return new Promise((resolve) => {
            SBSDKService.SDK.imageToJpeg(item).then((data) => {
                ImageUtils.toDataUrl(data).then((base64) => {
                    resolve(base64);
                });
            });
        });
    }

    static toDataUrl(buffer: ArrayBuffer): Promise<string> {
        return new Promise((resolve, reject) => {
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
        });
    }

    public static createImageDataCanvas(data: ImageData): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.className = "scanbot-sdk-canvas-element";
        canvas.width = data.width;
        canvas.height = data.height;
        canvas.getContext("2d")?.putImageData(data, 0, 0);
        return canvas;
    }

    // @ts-expect-error Temporarily unused, but important convenience function
    private static uuidv4(): string {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        );
    }

    static async generatePdf(image: Image, filename: string, options: PdfPageOptions) {
        const generator = await SBSDKService.SDK.beginPdf({})
        await generator.addPage(image, options);
        const pdf = await generator.complete();
        ImageUtils.save(pdf, "application/pdf", filename);
    }

    public static save(data: ArrayBuffer, mimeType: string, filename: string) {
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);
        const blob = new Blob([data], { type: mimeType });
        link.href = URL.createObjectURL(blob);

        link.download = filename;
        link.click();
    }
}

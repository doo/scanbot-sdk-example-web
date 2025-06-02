
export enum MimeType {
    Jpeg = "image/jpeg"
}

// TODO Some of these @types imports here cause rollup to fail
export default class ImageUtils {

    public static pick(mime: MimeType): Promise<Uint8Array> {
        console.log(`ImageUtils.pick(${mime})`);
        return new Promise(resolve => {
            resolve(new Uint8Array(0));
        })
    }

    static createBase64Image(item: unknown, images?: unknown[]): Promise<string> {
        console.log(item, images);
        return new Promise((resolve) => {
            resolve("");
        });
    }

    static async rawImageToBase64(result: unknown): Promise<string> {
        console.log(result);
        return "";
    }
}

// import { Image, PdfPageOptions, SBStoreCroppedDetectionResult, SBStoreImage } from "scanbot-web-sdk/@types";
// import SBSDKService from "./SBSDKService";
// import ScanbotSDK from "scanbot-web-sdk/ui";
//

//
// export default class ImageUtils {
//
//     public static pick(mime: MimeType): Promise<Uint8Array> {
//         return new Promise<Uint8Array>((resolve) => {
//             let picker = document.getElementById("picker") as HTMLInputElement;
//
//             if (!picker) {
//                 picker = document.createElement("input") as HTMLInputElement;
//                 document.body.appendChild(picker);
//                 picker.id = "picker";
//                 picker.type = "file";
//                 picker.accept = mime;
//
//             }
//             picker.click();
//
//             picker.onchange = (e) => {
//                 e.preventDefault();
//                 const reader = new FileReader();
//
//                 const files = picker?.files;
//                 if (!files) {
//                     return;
//                 }
//
//                 reader.readAsArrayBuffer(files[0]);
//
//                 reader.onload = async (e) => {
//                     console.log("reader.onload", e, reader.result);
//                     const result = reader.result;
//                     if (result instanceof ArrayBuffer) {
//                         resolve(new Uint8Array(result));
//                         picker.remove();
//                     } else {
//                         console.error("Invalid reader result", result);
//                     }
//                 };
//             };
//         });
//     }
//
//     static createBase64Image(item: SBStoreCroppedDetectionResult, images?: SBStoreImage[]): Promise<string> {
//         return new Promise((resolve) => {
//             const original = images ? images.find(i => i.documentId === item.id && i.type === "original") : item.originalImage;
//             const cropped = images ? images.find(i => i.documentId === item.id && i.type === "cropped") : item.result?.croppedImage;
//
//             let image: Image;
//
//             if (cropped) {
//                 if (cropped instanceof SBStoreImage) {
//                     image = ScanbotSDK.Config.Image.fromWrappedImage(cropped.data);
//                 } else {
//                     image = cropped;
//                 }
//             } else if (original) {
//                 if (original instanceof SBStoreImage) {
//                     image = ScanbotSDK.Config.Image.fromWrappedImage(original.data);
//                 } else {
//                     image = original;
//                 }
//             } else {
//                 return resolve("");
//             }
//
//             resolve(ImageUtils.rawImageToBase64(image));
//         });
//     }
//
//     static rawImageToBase64(item: Image | undefined): Promise<string> {
//
//         if (!item) {
//             return Promise.reject(new Error("Image is undefined"));
//         }
//
//         return new Promise((resolve) => {
//             SBSDKService.SDK.imageToJpeg(item).then((data) => {
//                 ImageUtils.toDataUrl(data).then((base64) => {
//                     resolve(base64);
//                 });
//             });
//         });
//     }
//
//     static toDataUrl(buffer: ArrayBuffer): Promise<string> {
//         return new Promise((resolve, reject) => {
//             const blob = new Blob([buffer], { type: 'image/jpeg' });
//             const reader = new FileReader();
//             reader.onload = () => resolve(reader.result as string);
//             reader.onerror = () => reject(reader.error);
//             reader.readAsDataURL(blob);
//         });
//     }
//
//     // @ts-expect-error Temporarily unused, but important convenience function
//     private static uuidv4(): string {
//         return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
//             (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
//         );
//     }
//
//     static async generatePdf(image: Image, filename: string, options: PdfPageOptions) {
//         const generator = await SBSDKService.SDK.beginPdf({})
//         await generator.addPage(image, options);
//         const pdf = await generator.complete();
//         ImageUtils.save(pdf, "application/pdf", filename);
//     }
//
//     public static save(data: ArrayBuffer, mimeType: string, filename: string) {
//         const link = document.createElement('a');
//         link.style.display = 'none';
//         document.body.appendChild(link);
//         const blob = new Blob([data], { type: mimeType });
//         link.href = URL.createObjectURL(blob);
//
//         link.download = filename;
//         link.click();
//     }
// }

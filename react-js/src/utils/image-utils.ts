import ScanbotSDK from "scanbot-web-sdk/webpack";

// @ts-ignore
import { pdfjs } from "react-pdf";

const resizeImg = require("resize-image-buffer");

const pdfVersion = "2.6.347";
const pdfWorkerUrl = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfVersion}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

export class ImageUtils {
  public static readonly MIME_TYPE_JPEG = "image/jpeg";
  public static readonly MIME_TYPE_PDF = "application/pdf";

  public static pick(mime: string, parentElement: HTMLElement, asDataUrl?: boolean): Promise<any> {
    return new Promise<any>((resolve) => {
      let picker = document.getElementById("picker" + parentElement.id) as HTMLInputElement;

      if (!picker) {
        picker = document.createElement("input") as HTMLInputElement;
        parentElement.appendChild(picker);
        picker.id = "picker" + parentElement?.id;
        picker.type = "file";
        picker.accept = mime;
       
        picker.style.marginLeft = '5px';
        parentElement.style.whiteSpace = "nowrap"
        parentElement.style.textOverflow = "ellipsis"
        parentElement.style.flexDirection = "row";
        parentElement.style.display = 'flex';
        parentElement.style.alignItems = 'center';
      }

      picker.onchange = (e) => {
        e.preventDefault();
        let reader = new FileReader();
        // @ts-ignore
        let file = e.target.files[0];
        if (asDataUrl) {
          reader.readAsDataURL(file);
        } else {
          reader.readAsArrayBuffer(file);
        }

        reader.onload = async (e) => {
          const result = reader.result;
          if (asDataUrl) {
            resolve({ data: result });
          } else {
            // @ts-ignore
            resolve({ original: new Uint8Array(result) });
          }
          picker.remove();
        };
      };
    });
  }

  static saveBytes(data: any, name: string) {
    const extension = name.split(".")[1];
    const a = document.createElement("a");
    document.body.appendChild(a);
    // @ts-ignore
    a.style = "display: none";
    const blob = new Blob([data], { type: `application/${extension}` });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    // Workaround for iOS 12, we were losing the cache and it was ending up WebKitBlobResource error
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  static async downscale(sdk: ScanbotSDK, data: Uint8Array): Promise<any> {
    // In order to keep the aspect ratio, find the dimensions of the image we're saving
    const dimensions = await this.getDimensions(sdk, data);

    // Set 200 as a baseline for testing purposes. The image in the saved PDF should be proper potato quality
    const base_size = 200;
    // Find the width-based ratio
    const ratio = dimensions.width / dimensions.height;

    const buffer = new Buffer(data);
    // Since we used width-based ratio, multiply max width by the ratio
    return await resizeImg(buffer, {
      width: base_size * ratio,
      height: base_size,
    });
  }

  private static async getDimensions(
    sdk: ScanbotSDK,
    data: Uint8Array
  ): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const image = new Image();
      image.onload = async () => {
        resolve({ width: image.width, height: image.height });
      };
      // The most accurate (albeit perhaps not most optimal)
      // way to get the actual width and height is to load it into an image object
      image.src = await sdk.toDataUrl(data);
    });
  }

  public static async pdfToImage(data: any) {
    const images: any[] = [];
    const pdf = await pdfjs.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas.toDataURL());
    }
    canvas.remove();
    return images;
  }
}

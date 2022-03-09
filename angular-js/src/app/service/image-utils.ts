export class ImageUtils {
  public static readonly MIME_TYPE_JPEG = "image/jpeg";
  public static readonly MIME_TYPE_PDF = "application/pdf";

  public static pick(mime: string, asDataUrl?: boolean): Promise<any> {
    return new Promise<any>((resolve) => {
      const picker = document.createElement("input") as HTMLInputElement;
      document.body.appendChild(picker);
      picker.type = "file";
      picker.accept = mime;
      picker.click();

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
          document.body.removeChild(picker)
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
}

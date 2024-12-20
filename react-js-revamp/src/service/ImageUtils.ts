
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
}

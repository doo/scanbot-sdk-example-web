import ScanbotSDK from "scanbot-web-sdk/webpack";

const resizeImg = require('resize-image-buffer');

export class ImageUtils {

    public static pick(): Promise<any> {
        return new Promise<any>(resolve => {
            const picker = document.getElementsByClassName("file-picker")[0] as HTMLElement;
            picker.click();

            picker.onchange = (e) => {
                console.log("change");
                e.preventDefault();
                let reader = new FileReader();
                // @ts-ignore
                let file = e.target.files[0];
                reader.readAsArrayBuffer(file);

                reader.onload = async (e) => {
                    // @ts-ignore
                    resolve({original: new Uint8Array(reader.result)});
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
        const blob = new Blob([data], {type: `application/${extension}`});
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url);
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
        return await resizeImg(buffer, {width: base_size * ratio, height: base_size});
    }

    private static async getDimensions(sdk: ScanbotSDK, data: Uint8Array): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const image = new Image();
            image.onload = async () => {
                resolve({width: image.width, height: image.height});
            };
            // The most accurate (albeit perhaps not most optimal)
            // way to get the actual width and height is to load it into an image object
            image.src = await sdk.toDataUrl(data);
        });
    }

}

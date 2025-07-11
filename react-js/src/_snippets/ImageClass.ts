/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";

export class ImageClass {

    static async pick() {
        const picker = document.createElement("input") as HTMLInputElement;
        document.body.appendChild(picker);
        picker.id = "picker";
        picker.type = "file";
        picker.click();

        picker.onchange = (e) => {
            e.preventDefault();
            const reader = new FileReader();

            const files = picker.files!;
            reader.readAsArrayBuffer(files[0]);

            reader.onload = async () => {
                const buffer = reader.result as ArrayBuffer;
                const image = ScanbotSDK.Config.Image.fromEncodedBinaryData(buffer);
                console.log("Picked image:", image);
            }
        }
    }

    static async fetch() {
        const image = await ScanbotSDK.Config.Image.fromUrl("/favicon.ico");
        console.log("Fetched image:", image);
    }

    static async draw() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const data = context!.getImageData(0, 0, canvas.width, canvas.height);
        const image = ScanbotSDK.Config.Image.fromImageData(data)
        console.log("Created image from ImageData:", image);
    }
}

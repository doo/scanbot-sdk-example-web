import ScanbotSDK from "scanbot-web-sdk/ui";

export class Launcher {

    static async execute() {

        // Create default configuration object.
        const config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
        const result = await ScanbotSDK.UI.createMrzScanner(config);

        if (!result) {
            return "No result. Your user most likely pressed the cancel button";
        }

        if (!result?.mrzDocument) {
            return "No MRZ document found";
        }

        const mapped = result?.mrzDocument.fields.map(field => {
            return `${field.type.name}:  ${field.value?.text}`
        });
        return mapped.join("\n");
    }
}

import ScanbotSDK from "scanbot-web-sdk";

export enum ContainerId {
    DocumentScanner = "document-scanner-container",
    BarcodeScanner = "barcode-scanner-container",
    VinScanner = "vin-scanner-container",
    MrzScanner = "mrz-scanner-container",
    TextPatternScanner = "text-pattern-scanner-container"
}

export default class SBSDKService {

    private static sdk: SBSDKService;

    /*
    * TODO add the license key here.
    * Please note: The Scanbot Web SDK has, without a license key, a trial period for one minute per session!
    * You can get a free "no-strings-attached" trial license.
    * Submit the trial license form (https://scanbot.io/trial/) on our website using "Web SDK" as the license type
    * and a corresponding domain name of your test environment (e.g. myapp.example.com or www.mywebsite.com).
    * Every trial license automatically includes "localhost" as a domain name for local development purposes.
    */
    static readonly license = "";

    public static async initialize() {
        if (!this.sdk) {

            this.sdk = await ScanbotSDK.initialize({
                licenseKey: this.license,
                // As of v7, you're required to define the location of WebAssembly binaries.
                // The binaries are located under node_modules/scanbot-web-sdk/bundle/.
                // In this example, we're automatically copying the complete bundle directory to the public wasm/ folder.
                // cf. package.json's script "postinstall" for more details
                enginePath: './wasm/'
            });
        }
    }
}


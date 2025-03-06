// Make sure to load the UI bundle if you want to use Ready-To-Use UI Components
import ScanbotSDK from "scanbot-web-sdk/ui";

export enum ContainerId {
    DocumentScanner = "document-scanner-container",
    BarcodeScanner = "barcode-scanner-container",
    VinScanner = "vin-scanner-container",
    MrzScanner = "mrz-scanner-container",
    TextPatternScanner = "text-pattern-scanner-container"
}

export default class SBSDKService {

    /*
    * TODO add the license key here.
    * Please note: The Scanbot Web SDK has, without a license key, a trial period for one minute per session!
    * You can get a free "no-strings-attached" trial license if you submit the form at: https://scanbot.io/trial/
    * using "Web SDK" as the license type and the domain name of your test environment (e.g. myapp.example.com or www.mywebsite.com).
    * Every trial license automatically includes "localhost" as a domain name for local development purposes.
    */
    static readonly license = "";

    /*
     * We have included an example of how to load the license key from the environment variables.
     * The .env file includes an expired license key, which won't allow ScanbotSDK to be used, not even for one minute.
     * To get a valid license key, please follow the instructions above.
     */
    // static readonly license = import.meta.env.VITE_EXPIRED_SCANBOT_LICENSE_KEY;

    public static async initialize() {
        // The SDK needs to be initialized before any other call and only once in the application's lifecycle.
        // This should be preferably done in the main component, after your site is loaded
        if (!this.sdk) {
            this.sdk = await ScanbotSDK.initialize({
                licenseKey: this.license,
                // As of v7, you're required to define the location of WebAssembly binaries.
                // The binaries are located under node_modules/scanbot-web-sdk/bundle/.
                // In this example, we're automatically copying the complete bundle directory to the public wasm/ folder.
                // have a look at package.json's script "postinstall" for more details
                enginePath: './wasm/'
            });
        }
    }

    public static get SDK(): ScanbotSDK {
        if (!this.sdk) {
            this.initialize()
        }
        return this.sdk;
    }

    private static sdk: ScanbotSDK;

}


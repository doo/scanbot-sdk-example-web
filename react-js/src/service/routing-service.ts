
export enum RoutePath {
    DocumentScanner = "document-scanner",
    DocumentOnJpeg = "document-on-jpeg",
    BarcodeOnJpeg = "barcode-on-jpeg",
    BarcodeOnPdf = "barcode-on-pdf",
    ImageResults = "image-results",
    ImageDetails = "image-details",
    LicenseInfo = "license-info",
    CroppingView = "cropping-view",
    BarcodeScanner = "barcode-scanner"
}

export class RoutingService {

    public static instance: RoutingService;

    private history: any;

    public static initialize(history: any) {
        console.log("Initializing routing service with history: ", history);
        this.instance = new RoutingService();
        this.instance.history = history;
    }

    public route(path: RoutePath, args?: any) {
        let query = "";
        if (args) {
            query += "?";
            const keys = Object.keys(args);
            keys.forEach((key: string) => {
                query += key + "=" + args[key];
            })
        }

        this.history.push("#/" + path + query);

    }

    public reset() {
        this.history.replace("#/");
    }

    public observeChanges(action: any) {
        this.history.listen((update: any) => {action();});
    }

    public back() {
       this.history.back();
    }
}

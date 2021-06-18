
export enum RoutePath {
    Home = '/',
    Onboarding = '/welcome',
    DocumentScanner = "document-scanner",
    BarcodeScanner = "barcode-scanner",
    ViewDocuments = '/view-documents',

    DocumentOnJpeg = "document-on-jpeg",
    BarcodeOnJpeg = "barcode-on-jpeg",
    BarcodeOnPdf = "barcode-on-pdf",
    ImageResults = "image-results",
    ImageDetails = "image-details",
    LicenseInfo = "license-info",
    CroppingView = "cropping-view",

}

export class RoutingService {

    public static instance: RoutingService;

    private history: any;

    public static initialize(history: any) {
        console.log("Initializing routing service with history: ", history);
        console.log(RoutingService)
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
        this.history.goBack();
    }

    public home() {
        this.history.push('/');
    }

    public goTo(path: RoutePath) {
        this.history.push(path);
    }

    public manualGoTo(path: string, state: any) {
        this.history.push({
            pathname: path,
            // search: '?query=abc',
            state: state
        })
    }

    public viewDetails(index: number) {
        this.history.push(`${RoutePath.ViewDocuments}/${index}`);
    }

    // public crop(index: number, state = {}) {
    //     this.history.push({
    //             pathname: `${RoutePath.ViewDocuments}/${index}/cropping-view`,
    //             // search: '?query=abc',
    //             state: state
    //     })
    // }
}

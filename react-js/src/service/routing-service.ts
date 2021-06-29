
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

    Acknowledgements = "/acknowledgements"

}

export class RoutingService {

    public static instance: RoutingService;

    private history: any;

    public static initialize(history: any) {
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
        this.history.push({pathname: path, state: state});
    }

    public viewDetails(index: number) {
        this.history.push(`${RoutePath.ViewDocuments}/${index}`);
    }

    public isHome(): boolean {
        return this.history.location.pathname === RoutePath.Home;
    }

    public isAtImageResult(): boolean {
        const path = this.history.location.pathname;
        // If it has an additional slash after view-documents, we're dealing with a specific image view
        return path.includes(RoutePath.ViewDocuments + RoutePath.Home);
    }

    static exists() {
        return this.instance !== undefined;
    }
}

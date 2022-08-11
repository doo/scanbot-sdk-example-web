import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export enum RoutePath {
  DocumentScanner = "document-scanner",
  DocumentOnJpeg = "document-on-jpeg",
  BarcodeOnJpeg = "barcode-on-jpeg",
  BarcodeOnPdf = "barcode-on-pdf",
  MrzScanner = "mrz-scanner",
  TextDataScanner = "text-data-scanner",
  ImageResults = "image-results",
  ImageDetails = "image-details",
  LicenseInfo = "license-info",
  CroppingView = "cropping-view",
  BarcodeScanner = "barcode-scanner",
}

export class RoutingService {
  public static instance = new RoutingService();

  public route(path: RoutePath, args?: any) {
    let query = "";
    if (args) {
      query += "?";
      const keys = Object.keys(args);
      keys.forEach((key: string) => {
        query += key + "=" + args[key];
      });
    }

    history.push("#/" + path + query);
  }

  public reset() {
    history.replace("#/");
  }

  public observeChanges(action: any) {
    history.listen((update) => {
      action();
    });
  }

  public back() {
    history.back();
  }
}

import { RoutePath } from "../service/routing-service";

export class Features {
  public static LIST = [
    {
      id: RoutePath.DocumentScanner,
      name: "Document Scanner",
      route: RoutePath.DocumentScanner,
    },
    {
      id: RoutePath.BarcodeScanner,
      name: "Barcode Scanner",
      route: RoutePath.BarcodeScanner,
    },
    {
      id: RoutePath.MrzScanner,
      name: "Mrz Scanner",
      route: RoutePath.MrzScanner,
    },
    {
      id: RoutePath.TextDataScanner,
      name: "Text Data Scanner",
      route: RoutePath.TextDataScanner,
    },
    { id: RoutePath.DocumentOnJpeg, name: "Detect document on .jpeg" },
    { id: RoutePath.BarcodeOnJpeg, name: "Detect barcodes on .jpeg" },
    { id: RoutePath.BarcodeOnPdf, name: "Detect barcodes on .pdf" },
    {
      id: RoutePath.ImageResults,
      name: "Image Results",
      route: RoutePath.ImageResults,
    },
    { id: RoutePath.LicenseInfo, name: "License Info" },
  ];
}

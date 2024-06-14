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
      id: RoutePath.BarcodeScannerWithOverlay,
      name: "Barcode Scanner with Overlay",
      route: RoutePath.BarcodeScannerWithOverlay,
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
    {
      id: RoutePath.VINScanner,
      name: "VIN Scanner",
      route: RoutePath.VINScanner,
    },
    {
      id: RoutePath.CheckScanner,
      name: "Check Scanner",
      route: RoutePath.CheckScanner,
    },
    {
      id: RoutePath.ScanAndCount,
      name: "Scan & Count",
      route: RoutePath.ScanAndCount,
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

class Config {
  static license() {
    return "";
  }

  static scannerContainerId() {
    return "scanbot-camera-container";
  }
  static barcodeScannerContainerId() {
    return "barcode-scanner-container";
  }
  static barcodeScannerOverlayContainerId() {
    return "barcode-scanner-overlay-container";
  }
  static mrzScannerContainerId() {
    return "mrz-scanner-container";
  }
  static textDataScannerContainerId() {
    return "text-data-scanner-container";
  }
  static croppingViewContainerId() {
    return "cropping-view-container";
  }

  static barcodeScannerConfig() {
    const barcodeFormats = [
      "AZTEC",
      "CODABAR",
      "CODE_39",
      "CODE_93",
      "CODE_128",
      "DATA_MATRIX",
      "EAN_8",
      "EAN_13",
      "ITF",
      "MAXICODE",
      "PDF_417",
      "QR_CODE",
      "RSS_14",
      "RSS_EXPANDED",
      "UPC_A",
      "UPC_E",
      "UPC_EAN_EXTENSION",
      "MSI_PLESSEY",
    ];

    return {
      // style: {
      //     window: {
      //         borderColor: "blue"
      //     },
      //     text: {
      //         color: "red",
      //         weight: 500
      //     }
      // },
      returnBarcodeImage: true,
      barcodeFormats: barcodeFormats,
      preferredCamera: 'camera2 0, facing back'
    };

  }
}

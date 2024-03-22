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
      "ONE_D",
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
      "UPC_A",
      "UPC_E",
      "UPC_EAN_EXTENSION",
      "MSI_PLESSEY",
      "IATA_2_OF_5",
      "INDUSTRIAL_2_OF_5",
      "CODE_25",
      "MICRO_QR_CODE",
      "USPS_INTELLIGENT_MAIL",
      "ROYAL_MAIL",
      "JAPAN_POST",
      "ROYAL_TNT_POST",
      "AUSTRALIA_POST",
      "DATABAR",
      "DATABAR_EXPANDED",
      "DATABAR_LIMITED",
      "GS1_COMPOSITE"
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

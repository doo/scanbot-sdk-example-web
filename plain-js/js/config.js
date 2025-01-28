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
  static textPatternScannerContainerId() {
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
      "MAXI_CODE",
      "PDF_417",
      "QR_CODE",
      "DATABAR",
      "DATABAR_EXPANDED",
      "UPC_A",
      "UPC_E",
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
      "DATABAR_LIMITED",
      "MICRO_PDF_417",
      "GS1_COMPOSITE",
      "RMQR_CODE",
      "CODE_11",
      "CODE_32",
      "PHARMA_CODE",
      "PHARMA_CODE_TWO_TRACK",
      "PZN_7"
    ];

    return {
      detectionParameters: {
        barcodeFormatConfigurations: [
          new ScanbotSDK.Config.BarcodeFormatCommonConfiguration({
            formats: barcodeFormats,
          })
        ]
      },
      preferredCamera: 'camera2 0, facing back'
    };

  }
}

class BarcodeScannerController {
    constructor() {
        this.container = Utils.getElementByClassName("barcode-scanner-controller");
        this.barcodeScanner = undefined;

        Utils.getElementByClassName("barcode-scanner-button").onclick = async (e) => {
            await this.show(e);
        };
    }

    async show() {
        Utils.getElementByClassName("barcode-scanner-controller").style.display = "block";

        const config = Config.barcodeScannerConfig();
        config.containerId = Config.barcodeScannerContainerId();
        config.onBarcodesDetected = onBarcodesDetected;
        config.onError = onScannerError;

        try {
            this.barcodeScanner = await scanbotSDK.createBarcodeScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            Utils.getElementByClassName("barcode-scanner-controller").style.display = "none";
        }
    }

    close() {
        this.container.style.display = "none";
        this.barcodeScanner.dispose();
        this.barcodeScanner = undefined;
    }
}
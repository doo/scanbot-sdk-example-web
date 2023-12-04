class BarcodeOverlayScannerController{

    constructor() {
        this.container = Utils.getElementByClassName("barcode-scanner-overlay-controller");
        this.barcodeScanner = undefined;

        Utils.getElementByClassName("barcode-scanner-overlay-button").onclick = async (e) => {
            await this.show();
        };
    }

    async show() {
        this.container.style.display = "block";

        const config = Config.barcodeScannerConfig();
        config.containerId = Config.barcodeScannerOverlayContainerId();
        config.onBarcodesDetected = (result) => {
            onBarcodesDetected(result);
        };
        config.onError = onScannerError;
        config.overlay = { visible: true };
        config.showFinder = false;

        try {
            this.barcodeScanner = await scanbotSDK.createBarcodeScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            Utils.getElementByClassName("barcode-scanner-overlay-controller").style.display = "none";
        }
    }

    close() {
        this.container.style.display = "none";
        this.barcodeScanner.dispose();
        this.barcodeScanner = undefined;
    }
}
class BarcodeScannerController {
    constructor() {
        this.barcodeScanner = undefined;

        Utils.getElementByClassName("barcode-scanner-button").onclick = async (e) => {
            await this.showScanner(e);
        };

        Utils.getElementByClassName("barcode-scanner-overlay-button").onclick = async (e) => {
            await this.showOverlayScanner();
        };
    }

    async showScanner() {
        this.container = Utils.getElementByClassName("barcode-scanner-controller");
        this.container.style.display = "block";

        const config = Config.barcodeScannerConfig();
        config.containerId = Config.barcodeScannerContainerId();
        config.onBarcodesDetected = (e) => {
            this.onBarcodesDetected(e);
        };
        config.onError = onScannerError;

        try {
            this.barcodeScanner = await scanbotSDK.createBarcodeScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            this.container.style.display = "none";
        }
    }

    async showOverlayScanner() {
        this.container = Utils.getElementByClassName("barcode-scanner-overlay-controller");
        this.container.style.display = "block";

        const config = Config.barcodeScannerConfig();
        config.containerId = Config.barcodeScannerOverlayContainerId();
        config.onBarcodesDetected = (result) => {
            this.onBarcodesDetected(result);
        };
        config.onError = onScannerError;
        config.overlay = {visible: true};
        config.showFinder = false;

        try {
            this.barcodeScanner = await scanbotSDK.createBarcodeScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            this.container.style.display = "none";
        }
    }

    close() {
        this.container.style.display = "none";
        this.barcodeScanner.dispose();
        this.barcodeScanner = undefined;
    }

    async onBarcodesDetected(e) {
        let text = "";
        e.barcodes.forEach((barcode) => {
            if (barcode.parsedText) {
                text += JSON.stringify(barcode.parsedText);
            } else {
                text += " " + barcode.text + " (" + barcode.format + "),";
            }
        });

        let result;
        if (e.barcodes[0].barcodeImage) {
            result = await scanbotSDK.toDataUrl(e.barcodes[0].barcodeImage);
        }

        Toastify({text: text.slice(0, -1), duration: 3000, avatar: result}).showToast();
    }
}
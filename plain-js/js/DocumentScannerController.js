class DocumentScannerController {

    constructor(results, documentListController) {
        this.results = results;
        this.documentListController = documentListController;
        this.container = Utils.getElementByClassName("scanbot-camera-controller");
        this.documentScanner = undefined;

        Utils.getElementByClassName("document-scanner-button").onclick = async (e) => {
            await this.show();
        };

        Utils.getElementByClassName("detection-done-button").onclick = async (e) => {
            await this.done();
        };
    }

    async show() {
        this.container.style.display = "block";

        const config = {
            containerId: Config.scannerContainerId(),
            acceptedAngleScore: 60,
            acceptedSizeScore: 60,
            autoCaptureSensitivity: 0.66,
            autoCaptureEnabled: true,
            ignoreBadAspectRatio: false,
            style: {
                outline: {
                    polygon: {
                        strokeWidth: 40,
                        fillCapturing: "rgba(0, 255, 0, 0.2)",
                        strokeCapturing: "green",
                        fillSearching: "rgba(255, 0, 0, 0.2)",
                        strokeSearching: "red",
                    }
                }
            },
            onDocumentDetected: (e) => {
                this.onDocumentDetected(e);
            },
            onError: onScannerError,
            text: {
                hint: {
                    OK: "Capturing your document...",
                    OK_SmallSize: "The document is too small. Try moving closer.",
                    OK_BadAngles:
                        "This is a bad camera angle. Hold the device straight over the document.",
                    OK_BadAspectRatio:
                        "Rotate the device sideways, so that the document fits better into the screen.",
                    OK_OffCenter: "Try holding the device at the center of the document.",
                    Error_NothingDetected:
                        "Please hold the device over a document to start scanning.",
                    Error_Brightness: "It is too dark. Try turning on a light.",
                    Error_Noise: "Please move the document to a clear surface.",
                },
            },
            preferredCamera: 'camera2 0, facing back'
        };

        try {
            this.documentScanner = await scanbotSDK.createDocumentScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            this.container.style.display = "none";
        }
    }

    async done() {
        this.close();

        this.documentListController.show();
    }

    close() {
        this.documentScanner.dispose();
        this.documentScanner = undefined;
        this.container.style.display = "none";
    }

    async onDocumentDetected(e) {
        this.results.push(e);
        ViewUtils.flash();
        Utils.getElementByClassName("page-count-indicator").innerHTML =
            results.length + " PAGES";
    }
}
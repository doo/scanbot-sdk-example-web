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
            detectionParameters: {
                acceptedAngleScore: 60,
                acceptedSizeScore: 60,
                autoCaptureSensitivity: 0.66,
            },
            autoCaptureEnabled: true,
            ignoreBadAspectRatio: false,
            style: {
                // Note that alternatively, styling the document scanner is also possible using CSS classes.
                // For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
                outline: {
                    polygon: {
                        strokeWidthCapturing: 8,
                        fillCapturing: "rgba(0, 255, 0, 0.2)",
                        strokeCapturing: "green",
                        strokeWidthSearching: 4,
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
                    OK_BUT_TOO_SMALL: "The document is too small. Try moving closer.",
                    OK_BUT_BAD_ANGLES:
                        "This is a bad camera angle. Hold the device straight over the document.",
                    OK_BUT_BAD_ASPECT_RATIO:
                        "Rotate the device sideways, so that the document fits better into the screen.",
                    OK_BUT_OFF_CENTER: "Try holding the device at the center of the document.",
                    ERROR_NOTHING_DETECTED:
                        "Please hold the device over a document to start scanning.",
                    ERROR_TOO_DARK: "It is too dark. Try turning on a light.",
                    ERROR_TOO_NOISY: "Please move the document to a clear surface.",
                    // Check the documentation for a complete list of available states.
                },
            },
            preferredCamera: 'camera2 0, facing back'
        };

        try {
            this.documentScanner = await scanbotSDK.createDocumentScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            await Utils.alert(e.name + ': ' + e.message);
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
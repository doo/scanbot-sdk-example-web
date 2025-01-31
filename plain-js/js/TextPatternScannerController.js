class TextPatternScannerController {

    constructor() {
        this.container = Utils.getElementByClassName("text-pattern-scanner-controller");

        Utils.getElementByClassName("text-pattern-scanner-button").onclick = async (e) => {
            await this.show();
        }
    }

    async show() {
        this.container.style.display = "block";
        const config = {
            containerId: Config.textPatternScannerContainerId(),
            onTextDetected: (textData) => {
                this.onTextDetected(textData);
            },
            onError: onScannerError,
            ocrConfiguration: {
                ocrResolutionLimit: 400
            },
            preferredCamera: 'camera2 0, facing back'
        };

        this.textDataScanner = await scanbotSDK.createTextPatternScanner(config);
    }

    async onTextDetected(textData) {
        if (!textData) return;

        if (textData.validationSuccessful) {
            if (typeof this.textDataScanner !== 'undefined') {
                await this.textDataScanner.pauseDetection();
            }
            await Utils.alert(textData.rawText);

            if (typeof this.textDataScanner !== 'undefined') {
                setTimeout(() => {
                    this.textDataScanner.resumeDetection()
                }, 500);
            }
        }
    }

    close() {
        this.container.style.display = "none";
        this.textDataScanner.dispose();
        this.textDataScanner = undefined;
    }

}
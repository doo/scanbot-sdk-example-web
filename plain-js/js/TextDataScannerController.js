class TextDataScannerController {

    constructor() {
        this.container = Utils.getElementByClassName("text-data-scanner-controller");

        Utils.getElementByClassName("text-data-scanner-button").onclick = async (e) => {
            await this.show();
        }
    }

    async show() {
        this.container.style.display = "block";
        const config = {
            containerId: Config.textDataScannerContainerId(),
            onTextDetected: (textData) => {
                this.onTextDataDetected(textData);
            },
            onError: onScannerError,
            ocrResolutionLimit: 400,
            supportedLanguages: ['eng', 'deu'],
            preferredCamera: 'camera2 0, facing back'
        };

        this.textDataScanner = await scanbotSDK.createTextDataScanner(config);
    }

    async onTextDataDetected(textData) {
        if (!textData) return;

        if (textData.validated) {
            if (typeof this.textDataScanner !== 'undefined') {
                await this.textDataScanner.pauseDetection();
            }

            alert(textData.text);

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
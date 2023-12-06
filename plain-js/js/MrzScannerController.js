class MrzScannerController {

    constructor() {
        this.container = Utils.getElementByClassName("mrz-scanner-controller");
        this.mrzScanner = undefined;

        Utils.getElementByClassName("mrz-scanner-button").onclick = async (e) => {
            await this.show();
        };
    }

    async show() {
        this.container.style.display = "block";

        const config = {
            containerId: Config.mrzScannerContainerId(),
            onMrzDetected: (mrz) => {
                this.onMrzDetected(mrz);
            },
            onError: onScannerError,
            preferredCamera: 'camera2 0, facing back'
        };

        try {
            this.mrzScanner = await scanbotSDK.createMrzScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            alert(e.name + ': ' + e.message);
            Utils.getElementByClassName("mrz-scanner-controller").style.display = "none";
        }
    }

    async onMrzDetected(mrz) {
        this.mrzScanner.pauseDetection();

        let text = "";
        if (mrz) {
            text += "Document Type: " + this.parseMRZValue(mrz, "documentType") + "\n";
            text += "First Name: " + this.parseMRZValue(mrz, "givenNames") + "\n";
            text += "Last Name: " + this.parseMRZValue(mrz, "surname") + "\n";
            text += "Issuing Authority: " + this.parseMRZValue(mrz, "issuingAuthority") + "\n";
            text += "Nationality: " + this.parseMRZValue(mrz, "nationality") + "\n";
            text += "Birth Date: " + this.parseMRZValue(mrz, "birthDate") + "\n";
            text += "Gender: " + this.parseMRZValue(mrz, "gender") + "\n";
            text += "Date of Expiry: " + this.parseMRZValue(mrz, "expiryDate") + "\n";
        } else {
            text = "No MRZ fields detected";
        }

        alert(text);

        setTimeout(() => {
            this.mrzScanner.resumeDetection();
        }, 1000);
    }

    parseMRZValue(input, key) {
        return input[key] ? (input[key].value + this.toConfidenceString(input, key)) : ''
    }

    toConfidenceString(input, key) {

        const confidence = input[key].confidence;

        if (!confidence) {
            return "";
        }

        return ` (${Number(confidence).toFixed(3)})`;
    }

    close() {
        this.container.style.display = "none";
        this.mrzScanner.dispose();
        this.mrzScanner = undefined;
    }

}
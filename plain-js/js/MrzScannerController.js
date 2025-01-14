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
            preferredCamera: 'camera2 0, facing back',
            recognizerConfiguration: {
                frameAccumulationConfiguration: {
                    maximumNumberOfAccumulatedFrames: 5,
                    minimumNumberOfAccumulatedFrames: 3,
                }
            }
        };

        try {
            this.mrzScanner = await scanbotSDK.createMrzScanner(config);
        } catch (e) {
            console.log(e.name + ': ' + e.message);
            await Utils.alert(e.name + ': ' + e.message);
            Utils.getElementByClassName("mrz-scanner-controller").style.display = "none";
        }
    }

    async onMrzDetected(mrz) {
        this.mrzScanner.pauseDetection();
        
        console.log(mrz);

        let text = "";
        if (mrz && mrz.success) {
            text += "Document Type: " + this.parseMRZValue(mrz, "DocumentType") + "\n";
            text += "First Name: " + this.parseMRZValue(mrz, "GivenNames") + "\n";
            text += "Last Name: " + this.parseMRZValue(mrz, "Surname") + "\n";
            text += "Issuing Authority: " + this.parseMRZValue(mrz, "IssuingAuthority") + "\n";
            text += "Nationality: " + this.parseMRZValue(mrz, "Nationality") + "\n";
            text += "Birth Date: " + this.parseMRZValue(mrz, "BirthDate") + "\n";
            text += "Gender: " + this.parseMRZValue(mrz, "Gender") + "\n";
            text += "Date of Expiry: " + this.parseMRZValue(mrz, "ExpiryDate") + "\n";
        } else {
            text = "No MRZ fields detected";
        }

        await Utils.alert(text);

        setTimeout(() => {
            this.mrzScanner.resumeDetection();
        }, 1000);
    }

    parseMRZValue(input, key) {
        const field = input.document.fields.find(field => field.type.name === key);
        if(field) {
            return field.value.text + this.toConfidenceString(field);
        }
        return "";
    }

    toConfidenceString(field) {

        const confidence = field.value.confidence;

        if (!confidence) {
            return "";
        }

        return ` (${Number(confidence).toFixed(3)}%)`;
    }

    close() {
        this.container.style.display = "none";
        this.mrzScanner.dispose();
        this.mrzScanner = undefined;
    }

}
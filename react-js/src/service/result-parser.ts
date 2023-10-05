import { MrzResult } from "scanbot-web-sdk/@types";

export default class ResultParser {

    private static toConfidenceString(input: any, key: string): string {
        const confidence = input[key].confidence;

        if (!confidence) {
            return "";
        }
        return ` (${Number(confidence).toFixed(3)})`
    }

    private static parseMRZValue(input: any, key: string) {
        return input[key] ? (input[key].value + this.toConfidenceString(input, key)) : ''
    }

    public static MRZToString(mrz: MrzResult): string {
        let text = "";

        text += "Document Type: " + this.parseMRZValue(mrz, 'documentType') + "\n";
        text += "First Name: " + this.parseMRZValue(mrz, 'givenNames') + "\n";
        text += "Last Name: " + this.parseMRZValue(mrz, 'surname') + "\n";
        text += "Issuing Authority: " + this.parseMRZValue(mrz, 'issuingAuthority') + "\n";
        text += "Nationality: " + this.parseMRZValue(mrz, "nationality") + "\n";
        text += "Birth Date: " + this.parseMRZValue(mrz, "birthDate") + "\n";
        text += "Gender: " + this.parseMRZValue(mrz, "gender") + "\n";
        text += "Date of Expiry: " + this.parseMRZValue(mrz, "expiryDate") + "\n";

        return text;
    }
}
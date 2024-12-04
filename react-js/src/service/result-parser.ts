import { MrzScannerResult } from "scanbot-web-sdk/@types";

export default class ResultParser {

    private static toConfidenceString(field: any): string {
        const confidence = field.value.confidence;

        if (!confidence) {
            return "";
        }

        return ` (${Number(confidence).toFixed(3)}%)`;
    }

    private static parseMRZValue(input: any, key: string) {
        const field = input.document.fields.find((field: any) => field.type.name === key);
        if(field) {
            return field.value.text + this.toConfidenceString(field);
        }
        return "";
    }

    public static MRZToString(mrz: MrzScannerResult): string {
        let text = "";

        text += "Document Type: " + this.parseMRZValue(mrz, 'DocumentType') + "\n";
        text += "First Name: " + this.parseMRZValue(mrz, 'GivenNames') + "\n";
        text += "Last Name: " + this.parseMRZValue(mrz, 'Surname') + "\n";
        text += "Issuing Authority: " + this.parseMRZValue(mrz, 'IssuingAuthority') + "\n";
        text += "Nationality: " + this.parseMRZValue(mrz, "Nationality") + "\n";
        text += "Birth Date: " + this.parseMRZValue(mrz, "BirthDate") + "\n";
        text += "Gender: " + this.parseMRZValue(mrz, "Gender") + "\n";
        text += "Date of Expiry: " + this.parseMRZValue(mrz, "ExpiryDate") + "\n";

        return text;
    }
}
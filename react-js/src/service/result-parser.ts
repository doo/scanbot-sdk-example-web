import { MrzResult } from "scanbot-web-sdk/@types";

export default class ResultParser {

    public static MRZToString(mrz: MrzResult): string {
        let text = "";
        text =
            text +
            "Document Type: " +
            mrz.documentType?.value +
            ` (${Number(mrz.documentType?.confidence).toFixed(3)})\n`;
        text =
            text +
            "First Name: " +
            mrz.givenNames?.value +
            ` (${Number(mrz.givenNames?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Last Name: " +
            mrz.surname?.value +
            ` (${Number(mrz.surname?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Issuing Authority: " +
            mrz.issuingAuthority?.value +
            ` (${Number(mrz.issuingAuthority?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Nationality: " +
            mrz.nationality?.value +
            ` (${Number(mrz.nationality?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Birth Date: " +
            mrz.birthDate?.value +
            ` (${Number(mrz.birthDate?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Gender: " +
            mrz.gender?.value +
            ` (${Number(mrz.gender?.confidence).toFixed(3)})\n`;
        text =
            text +
            "Date of Expiry: " +
            mrz.expiryDate?.value +
            ` (${Number(mrz.expiryDate?.confidence).toFixed(3)})\n`;

        return text;
    }
}
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import {
    BarcodeScannerConfiguration,
    AAMVA,
    BoardingPass,
    DEMedicalPlan,
    GS1,
    HIBC,
    IDCardPDF417,
    MedicalCertificate,
    SEPA,
    SwissQR,
    VCard,
    BarcodeScannerResult
} from "scanbot-web-sdk/@types";

// Mock the ScanbotSDK initialization for this snippet
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function configureBarcodeScannerParser() {
    const config = new BarcodeScannerConfiguration({
        barcodeFormatConfigurations: [],
        extractedDocumentFormats: [
            "AAMVA",
            "BOARDING_PASS",
            "DE_MEDICAL_PLAN",
            "MEDICAL_CERTIFICATE",
            "ID_CARD_PDF_417",
            "SEPA",
            "SWISS_QR",
            "VCARD",
            "GS1",
            "HIBC"
        ],
        onlyAcceptDocuments: true,
        engineMode: "NEXT_GEN"
    });
    const image = await ScanbotSDK.Config.Image.fromUrl("<put-real-image-url-here");
    const response = await sdk.detectBarcodes(image, config);
    await processResult(response)
}

export async function processResult(result: BarcodeScannerResult) {
    for (const barcode of result.barcodes) {
        const document = barcode.extractedDocument;

        if (!document) {
            console.log("No document data extracted for barcode:", barcode);
            continue;
        }

        const type = document.type.name;
        if (type === AAMVA.DOCUMENT_TYPE) {
            const aamva = new AAMVA(document);
            const title = aamva.titleData;
            const vehicle = aamva.vehicleData;
            const registration = aamva.registrationData;
            console.log("AAMVA Document detected:", title, vehicle, registration);
        } else if (type === BoardingPass.DOCUMENT_TYPE) {
            const boardingPass = new BoardingPass(document);
            const passenger = boardingPass.passengerName;
            const legs = boardingPass.legs;
            console.log("Boarding Pass detected:", passenger, legs);
        } else if (type === MedicalCertificate.DOCUMENT_TYPE) {
            const medicalCertificate = new MedicalCertificate(document);
            const name = medicalCertificate.firstName;
            console.log("Medical Certificate detected:", name);
        } else if (type === DEMedicalPlan.DOCUMENT_TYPE) {
            const medicalPlan = new DEMedicalPlan(document);
            const doctor = medicalPlan.doctor;
            const patient = medicalPlan.patient;
            console.log("DE Medical Plan detected:", doctor, patient);
        } else if (type === IDCardPDF417.DOCUMENT_TYPE) {
            const idCard = new IDCardPDF417(document);
            const firstName = idCard.firstName;
            const lastName = idCard.lastName;
            console.log("ID Card PDF417 detected:", firstName, lastName);
        } else if (type === GS1.DOCUMENT_TYPE) {
            const gs1 = new GS1(document);
            const elements = gs1.elements;
            console.log("GS1 Document detected:", elements);
        } else if (type === SEPA.DOCUMENT_TYPE) {
            const sepa = new SEPA(document);
            const receiver = sepa.receiverName;
            const amount = sepa.amount;
            console.log("SEPA Document detected:", receiver, amount);
        } else if (type === SwissQR.DOCUMENT_TYPE) {
            const swissQR = new SwissQR(document);
            const payee = swissQR.payeeName;
            const amount = swissQR.amount;
            console.log("Swiss QR Document detected:", payee, amount);
        } else if (type === VCard.DOCUMENT_TYPE) {
            const vCard = new VCard(document);
            const name = vCard.name;
            const emails = vCard.emails;
            console.log("VCard Document detected:", name, emails);
        } else if (type == HIBC.DOCUMENT_TYPE) {
            const hibc = new HIBC(document);
            const lot = hibc.lotNumber;
            const serial = hibc.serialNumber;
            console.log("HIBC Document detected:", lot, serial);
        } else {
            // Handle other document types if needed
        }
    }
}

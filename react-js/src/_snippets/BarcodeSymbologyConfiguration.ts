/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import {
    BarcodeFormatAustraliaPostConfiguration,
    BarcodeFormatCode11Configuration,
    BarcodeFormatCode2Of5Configuration,
    BarcodeFormatCommonConfiguration,
    BarcodeFormatConfigurationBase,
    BarcodeFormatMsiPlesseyConfiguration,
    BarcodeFormats,
    BarcodeScannerViewConfiguration
} from "scanbot-web-sdk/@types";

// Mock the ScanbotSDK initialization for this snippet
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export async function createSingleSymbologyScanner() {

    const formatConfig = new BarcodeFormatCommonConfiguration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        gs1Handling: "PARSE",
        strictMode: true,
        formats: ["QR_CODE", "AZTEC", "CODE_128"]
    })

    const config: BarcodeScannerViewConfiguration = {
        detectionParameters: {
            barcodeFormatConfigurations: [formatConfig],
        }
    };
    await sdk.createBarcodeScanner(config);
}

export async function createMultipleSymbologyScanner() {

    const formatConfigurations: BarcodeFormatConfigurationBase[] = [];
    const baseConfig = new BarcodeFormatCommonConfiguration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        gs1Handling: "PARSE",
        strictMode: true,
        formats: BarcodeFormats.common,
        addAdditionalQuietZone: false
    });
    formatConfigurations.push(baseConfig);

    // Add individual configurations for specific barcode formats
    const australiaPostConfig = new BarcodeFormatAustraliaPostConfiguration({
        regexFilter: "",
        australiaPostCustomerFormat: "ALPHA_NUMERIC"
    });
    formatConfigurations.push(australiaPostConfig)

    const msiPlesseyConfig = new BarcodeFormatMsiPlesseyConfiguration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        checksumAlgorithms: ["MOD_10"]
    });
    formatConfigurations.push(msiPlesseyConfig)

    const code11Config = new BarcodeFormatCode11Configuration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        checksum: true
    });
    formatConfigurations.push(code11Config)

    const code2Of5Config = new BarcodeFormatCode2Of5Configuration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        iata2of5: true,
        code25: false,
        industrial2of5: false,
        useIATA2OF5Checksum: true
    });
    formatConfigurations.push(code2Of5Config)

    const config: BarcodeScannerViewConfiguration = {
        detectionParameters: {
            barcodeFormatConfigurations: formatConfigurations,
        }
    };
    await sdk.createBarcodeScanner(config);
}

export async function createCommonFilteringConfiguration() {
    const formatConfig = new BarcodeFormatCommonConfiguration({
        regexFilter: "",
        minimum1DQuietZoneSize: 10,
        stripCheckDigits: false,
        minimumTextLength: 0,
        maximumTextLength: 0,
        gs1Handling: "PARSE",
        strictMode: true,
        formats: BarcodeFormats.common,
        addAdditionalQuietZone: false
    });

    const config: BarcodeScannerViewConfiguration = {
        detectionParameters: {
            barcodeFormatConfigurations: [formatConfig],
        }
    };
    await sdk.createBarcodeScanner(config);
}

export async function createDocumentParserConfiguration() {
    const formatConfigurations: BarcodeFormatConfigurationBase[] = [];
    const config: BarcodeScannerViewConfiguration = {
        detectionParameters: {
            barcodeFormatConfigurations: formatConfigurations,
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
        }
    };
    await sdk.createBarcodeScanner(config);
}

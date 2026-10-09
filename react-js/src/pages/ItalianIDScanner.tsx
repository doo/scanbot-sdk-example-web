import React, { useRef, useEffect } from "react";
import {
    CommonFieldType,
    DocumentDataExtractionResult,
    DocumentDataExtractorViewConfiguration,
    GenericDocument,
    IDocumentDataExtractorHandle,
} from "scanbot-web-sdk/@types";

import SBSDKService, { ContainerId } from "../service/SBSDKService";
import SBSDKPage from "../subviews/SBSDKPage";
import ScanbotSDK from "scanbot-web-sdk/ui";

// Labels for the fields found directly on the front side (ItIdCardFront), keyed by common field type.
// Birthplace and PlaceOfIssue only exist on the front; there is no equivalent on the back.
const FRONT_FIELD_LABELS: Partial<Record<CommonFieldType, string>> = {
    GIVEN_NAMES: "First Name",
    SURNAME: "Last Name",
    BIRTH_DATE: "Date of Birth",
    BIRTHPLACE: "Place of Birth",
    NATIONALITY: "Nationality",
    GENDER: "Sex",
    ID: "Document Number",
    PLACE_OF_ISSUE: "Municipality of Issue",
};

// Labels for the fields found on the back side (ItIdCardBack), read from its embedded MRZ child
// document, keyed by the MRZ field's normalized name.
const BACK_MRZ_FIELD_LABELS: Record<string, string> = {
    "MRZ.GivenNames": "First Name",
    "MRZ.Surname": "Last Name",
    "MRZ.BirthDate": "Date of Birth",
    "MRZ.Nationality": "Nationality",
    "MRZ.Gender": "Sex",
    "MRZ.DocumentNumber": "Document Number",
    "MRZ.DocumentType": "Document Type",
};

function processItalianIdFrontResult(document: GenericDocument): string {
    let text = `Document Type: ${document.type.name}\n`;
    for (const field of document.fields) {
        const label = field.type.commonType && FRONT_FIELD_LABELS[field.type.commonType];
        if (label) {
            text += `${label}: ${field.value?.text}\n`;
        }
    }
    return text;
}

function processItalianIdBackResult(document: GenericDocument): string {
    let text = `Document Type: ${document.type.name}\n`;
    const mrz = document.children.find((child) => child.type.name === "MRZ");
    for (const field of mrz?.fields ?? []) {
        const label = BACK_MRZ_FIELD_LABELS[field.type.normalizedName];
        if (label) {
            text += `${label}: ${field.value?.text}\n`;
        }
    }
    return text;
}

function processItalianIdResult(document: GenericDocument | null): string {
    if (document === null) {
        return "Document detection failed or not validated.";
    }

    return document.type.name === "ItIdCardFront"
        ? processItalianIdFrontResult(document)
        : processItalianIdBackResult(document);
}

export default function ItalianIDScanner() {

    const handle = useRef<IDocumentDataExtractorHandle | null>(null);
    const [toast, setToast] = React.useState<string | undefined>(undefined);

    const onDocumentDetected = async (result: DocumentDataExtractionResult) => {
        const status = result.status;
        if (status === "ERROR_NOTHING_FOUND" || status === "ERROR_UNKNOWN_DOCUMENT") {
            // Handle various error cases, see all DocumentDataExtractionStatus types
            return;
        }
        console.log("DDE result:", result);
        setToast(processItalianIdResult(result.document));
    };

    useEffect(() => {

        async function load() {
            await SBSDKService.initialize();

            const config: DocumentDataExtractorViewConfiguration = {
                containerId: ContainerId.ItalianIDScanner,
                onDocumentDetected: onDocumentDetected,
                finder: {
                    _type: "ViewFinderConfiguration",
                    // ID-1 card format (ISO/IEC 7810): 85.6 x 53.98 mm
                    aspectRatio: new ScanbotSDK.Config.AspectRatio({ width: 85.6, height: 53.98 }),
                },
                userGuidance: {
                    // Hide default user guidance, as we want to show our dynamic instructions
                    visible: false,
                },
                scannerConfiguration: {
                    configurations: [
                        new ScanbotSDK.Config.DocumentDataExtractorCommonConfiguration({
                            acceptedDocumentTypes: ["ItIdCardFront", "ItIdCardBack"]
                        })
                    ]
                }
            };
            handle.current = await SBSDKService.SDK.createDocumentDataExtractor(config);
        }

        load().then(() => {
            console.log("Scanbot SDK Document Data Extractor is ready!");
        });

        return () => {
            // If the component unmounts, and the scanner has been initialized, dispose the SDK scanner instance
            handle.current?.dispose();
        };
    }, []);

    return <><SBSDKPage title={"Italian ID Scanner"} containerId={ContainerId.ItalianIDScanner}
                        toast={{ text: toast }} /><div id="result"></div></>;
}

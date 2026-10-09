import React, { useRef, useEffect } from "react";
import {
    CommonFieldType,
    DocumentDataExtractionResult,
    DocumentDataExtractionStatus,
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

const HINT_TEXTS: Record<DocumentDataExtractionStatus, string> = {
    ERROR_NOTHING_FOUND: "Place the front or back of your Italian ID card in the frame",
    SCANNING_IN_PROGRESS_STILL_FOCUSING: "Hold still, focusing...",
    SCANNING_IN_PROGRESS: "Scanning, keep the card steady...",
    ERROR_BAD_CROP: "Hold the card straight and move it closer or further away",
    ERROR_UNKNOWN_DOCUMENT: "This is not a supported document",
    ERROR_UNACCEPTABLE_DOCUMENT: "Please scan an Italian ID card",
    OK_BUT_LOW_CONFIDENCE_RESULTS: "Low quality scan, please try again",
    OK_BUT_INVALID_DOCUMENT: "The document could not be validated",
    OK: "Document scanned successfully",
};

export default function ItalianIDScanner() {

    const handle = useRef<IDocumentDataExtractorHandle | null>(null);

    const [hint, setHint] = React.useState<string>(HINT_TEXTS.ERROR_NOTHING_FOUND);

    const onDocumentDetected = async (result: DocumentDataExtractionResult) => {
        setHint(HINT_TEXTS[result.status]);
        const status = result.status;
        if (status === "ERROR_NOTHING_FOUND" || status === "ERROR_UNKNOWN_DOCUMENT") {
            // Handle various error cases, see all DocumentDataExtractionStatus types
            return;
        }

        if (status === "OK") {
            // If front scanning is successful and you require specific data from the back side,
            // here you would now set the custom hint text to "Please scan the back" or something similar
            const processed = processItalianIdResult(result.document);
            console.log("Processed Italian ID result:\n", processed);
        }
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

    return <>
        <SBSDKPage title={"Italian ID Scanner"} containerId={ContainerId.ItalianIDScanner} />
        <div style={{
            position: "fixed", left: 0, right: 0, bottom: 48, display: "flex",
            justifyContent: "center", pointerEvents: "none", zIndex: 10,
        }}>
            <div style={{
                padding: "8px 16px", borderRadius: 8, maxWidth: "90%", textAlign: "center",
                background: "rgba(0, 0, 0, 0.6)", color: "#fff", fontSize: 16,
            }}>{hint}</div>
        </div>
        <div id="result"></div>
    </>;
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyLocalizationConfig(config: UIConfig.DocumentScanningFlow) {
    // Retrieve a reference of the localization object from the configuration object.
    const localization = config.localization;

    // The localization object already has english default values set. 
    // Here, only a subset of the available properties is shown.
    localization.cameraTopBarTitle = "Document Scanner";
    localization.reviewScreenSubmitButtonTitle = "Submit";
    localization.cameraUserGuidanceNoDocumentFound = "No document found";
    localization.cameraUserGuidanceTooDark = "Video is too dark for scanning";
}
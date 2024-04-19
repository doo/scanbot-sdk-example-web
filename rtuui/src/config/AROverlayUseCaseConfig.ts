
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";

export function AROverlayUseCaseConfig() {

	const config = new ScanbotSDK.UI.Config.MultipleScanningMode();

    config.mode = "UNIQUE";
    config.sheet.mode = "COLLAPSED_SHEET";
    config.sheet.collapsedVisibleHeight = "SMALL";
    
    // Configure AR Overlay.
    config.arOverlay.visible = true;
    config.arOverlay.automaticSelectionEnabled = false;

    // Configure other parameters, pertaining to use case as needed.
	return config;
}
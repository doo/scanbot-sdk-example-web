
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";

export function createAROverlayUseCaseConfig() {

	const config = new ScanbotSDK.UI.Config.ArOverlayGeneralConfiguration();

    // Configure AR Overlay.
    config.visible = true;
    config.automaticSelectionEnabled = false;

    // Configure other parameters, pertaining to use case as needed.
	return config;
}
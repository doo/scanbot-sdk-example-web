
/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { BarcodeScannerConfiguration } from "scanbot-web-sdk/@types/ui2/configuration";

export function applyActionBarConfig(config: BarcodeScannerConfiguration) {

	config.actionBar.flashButton.visible = true;

	// Configure the inactive state of the flash button.
	config.actionBar.flashButton.backgroundColor = "#0000007A";
	config.actionBar.flashButton.foregroundColor = "#FFFFFF";

	// Configure the active state of the flash button.
	config.actionBar.flashButton.activeBackgroundColor = "#FFCE5C";
	config.actionBar.flashButton.activeForegroundColor = "#000000";

	// Hide/unhide the zoom button.
	config.actionBar.zoomButton.visible = true

	// Configure the inactive state of the zoom button.
	// The zoom button has no active state - it only switches between zoom levels. 
	// For configuring those please refer to camera configuring
	config.actionBar.zoomButton.backgroundColor = "#0000007A";
	config.actionBar.zoomButton.foregroundColor = "#FFFFFF";

	// Hide/unhide the flip camera button.
	config.actionBar.flipCameraButton.visible = true

	// Configure the inactive state of the flip camera button.
	config.actionBar.flipCameraButton.backgroundColor = "#0000007A";
	config.actionBar.flipCameraButton.foregroundColor = "#FFFFFF";
}

/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 * 
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk";

export function createActionBarConfig() {

	const config = new ScanbotSDK.UI.Config.ActionBarConfiguration();

	config.flashButton.visible = true;

	// Configure the inactive state of the flash button.
	config.flashButton.backgroundColor = "#7A000000";
	config.flashButton.foregroundColor = "#FFFFFF";

	// Configure the active state of the flash button.
	config.flashButton.activeBackgroundColor = "#FFCE5C";
	config.flashButton.activeForegroundColor = "#000000";

	// Hide/unhide the zoom button.
	config.zoomButton.visible = true

	// Configure the inactive state of the zoom button.
	// The zoom button has no active state - it only switches between zoom levels. 
	// For configuring those please refer to camera configuring
	config.zoomButton.backgroundColor = "#7A000000";
	config.zoomButton.foregroundColor = "#FFFFFF";

	// Hide/unhide the flip camera button.
	config.flipCameraButton.visible = true

	// Configure the inactive state of the flip camera button.
	config.flipCameraButton.backgroundColor = "#7A000000";
	config.flipCameraButton.foregroundColor = "#FFFFFF";
	
	return config;
}
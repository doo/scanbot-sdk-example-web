/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";

export function applyCroppingScreenConfig(config: UIConfig.DocumentScanningFlow) {
    // Set the background color of the bottom & bottom bar.
    config.appearance.bottomBarBackgroundColor = "#C8193C";
    config.appearance.topBarBackgroundColor = "#FF0000";

    // Customize the buttons on the cropping screen
    config.localization.croppingTopBarCancelButtonTitle = "Cancel";
    config.screens.cropping.topBarConfirmButton.foreground.color = '#FFFFFF';
    config.screens.cropping.bottomBar.rotateButton.visible = false;
}
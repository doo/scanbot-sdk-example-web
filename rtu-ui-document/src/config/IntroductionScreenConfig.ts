/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import { UIConfig } from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk/ui";

export function applyIntroductionScreenConfig(config: UIConfig.DocumentScanningFlow) {

    config.screens.camera.introduction.showAutomatically = true;
    config.screens.camera.introduction.items = [

        new ScanbotSDK.UI.Config.IntroListEntry({
            // You can reference colors from the palette by using the `?` prefix
            text: { text: 'The following image demonstrates the scanning process.', color: '?sbColorOnSurface' },
            image: new ScanbotSDK.UI.Config.CustomImage({uri: "https://placehold.co/600x400"})
        }),

        new ScanbotSDK.UI.Config.IntroListEntry({
            text: { text: 'You can also use one of the bundled images instead.', color: '?sbColorOnSurface' },
            image: new ScanbotSDK.UI.Config.CheckIntroImage()
        }),

        new ScanbotSDK.UI.Config.IntroListEntry({
            text: { text: 'Or just text entries without an image.', color: '?sbColorOnSurface' },
        }),
        
    ];
}
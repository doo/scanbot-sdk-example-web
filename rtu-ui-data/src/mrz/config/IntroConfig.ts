/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */
import ScanbotSDK from "scanbot-web-sdk/ui";
import { UIConfig } from "scanbot-web-sdk/@types";

export function applyIntroConfig(config?: UIConfig.MrzScannerScreenConfiguration) {

    if (!config) {
        // If missing create a new configuration object, else apply configuration to the parameter.
        config = new ScanbotSDK.UI.Config.MrzScannerScreenConfiguration();
    }

    const intro = config.introScreen;

    // Show the introduction screen automatically when the screen appears.
    intro.showAutomatically = true;

    // Configure the background color of the screen.
    intro.backgroundColor = "#FFFFFF";

    // Configure the title for the intro screen.
    intro.title.text = "How to scan an MRZ"

    // Configure the image for the introduction screen.
    // If you want to have no image...
    intro.image = new ScanbotSDK.UI.Config.MrzIntroNoImage();
    // For a custom image...
    intro.image = new ScanbotSDK.UI.Config.MrzIntroCustomImage({ uri: "https://example.com/image.jpg" });
    // Or you can also use our default image.
    intro.image = new ScanbotSDK.UI.Config.MrzIntroDefaultImage();

    // Configure the color of the handler on top.
    intro.handlerColor = "#EFEFEF";

    // Configure the color of the divider.
    intro.dividerColor = "#EFEFEF";

    // Configure the text.
    intro.text.color = "#000000";
    intro.text.text = "The Machine Readable Zone (MRZ) is a special code on your ID document " +
        "(such as a passport or ID card) that contains your personal information in a machine-readable format.\n\n" +
        "To scan it, simply hold your camera over the document, so that it aligns with the MRZ section. " +
        "Once scanned, the data will be automatically processed, " +
        "and you will be directed to the results screen.\n\nPress 'Start Scanning' to begin."

    // Configure the done button.
    // e.g the text or the background color.
    intro.doneButton.text = "Start Scanning"
    intro.doneButton.background.fillColor = "#C8193C";
}

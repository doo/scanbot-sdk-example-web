/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { SBDocument } from "scanbot-web-sdk/@types";

export async function filterAndRotate(document: SBDocument) {

    for (const page of document.pages) {

        const filter1 = new ScanbotSDK.Config.ScanbotBinarizationFilter({ outputMode: "ANTIALIASED" });
        const filter2 = new ScanbotSDK.Config.BrightnessFilter({ brightness: 0.4});

        await document.apply(page, {
            rotations: (page.getData().rotations ?? 0) + 1,
            filters: [filter1, filter2],
        });
    }
}

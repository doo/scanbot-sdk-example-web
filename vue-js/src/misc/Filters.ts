import type {BinarizationFilter, ColorFilter, ImageFilter} from "scanbot-web-sdk/@types";

export class Filters {
    public static binarizationFilters(): BinarizationFilter[] {
        return [
            "binarized",
            "otsuBinarization",
            "pureBinarized",
            "lowLightBinarization",
            "lowLightBinarization2",
            "deepBinarization",
        ];
    }

    public static colorFilters(): ColorFilter[] {
        return ["color", "gray", "colorDocument", "blackAndWhite", "edgeHighlight"];
    }

    public static availableFilters(): ("none" | ImageFilter)[] {
        return ["none", ...this.binarizationFilters(), ...this.colorFilters()];
    }
}

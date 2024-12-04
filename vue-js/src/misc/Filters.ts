import ScanbotSDK from "scanbot-web-sdk";
import type { Image, ParametricFilter } from "scanbot-web-sdk/@types";
import { toRaw } from "vue";

export class Filters {
  public static availableFilters = 
    ["none", "ScanbotBinarizationFilter", "GrayscaleFilter", "ContrastFilter", "ColorDocumentFilter"] as const;

  public static async applyFilter(scanbotSDK: ScanbotSDK, image: Image, filterName: Exclude<typeof Filters.availableFilters[number], "none">) {
    const filter: ParametricFilter = new ScanbotSDK.Config[filterName]();
    return await scanbotSDK.imageFilter(toRaw(image), filter);
  }
}

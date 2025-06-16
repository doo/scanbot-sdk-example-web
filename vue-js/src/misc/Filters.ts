import ScanbotSDK from "scanbot-web-sdk";
import type { Image, ParametricFilter } from "scanbot-web-sdk/@types";
import { toRaw } from "vue";

export class Filters {
  public static availableFilters = 
    ["none", "ScanbotBinarizationFilter", "GrayscaleFilter", "ContrastFilter", "ColorDocumentFilter"] as const;

  public static async applyFilter(sdk: ScanbotSDK, image: Image, name: Exclude<typeof Filters.availableFilters[number], "none">) {
    const filter: ParametricFilter = new ScanbotSDK.Config[name]();
    
    const processor = await sdk.createImageProcessor();
    const response = await processor.applyFilter(toRaw(image), filter);
    
    return response.result;
  }
}

import type {BinarizationFilter, ColorFilter, ImageFilter} from "scanbot-web-sdk/@types";
import ScanbotSDK from "scanbot-web-sdk";

export class Filters {
  public static availableFilters(): ("none" | keyof typeof ScanbotSDK.imageFilters)[] {
    return ["none", "ScanbotBinarizationFilter", "GrayscaleFilter", "ContrastFilter", "ColorDocumentFilter"];
    }

  public static async applyFilter(scanbotSDK: ScanbotSDK, image: ArrayBuffer, filterName: keyof typeof ScanbotSDK.imageFilters) {
    const imageProcessor = await scanbotSDK.createImageProcessor(image);
    const filter = new ScanbotSDK.imageFilters[filterName]();
    await imageProcessor.applyFilter(filter);
    const result = imageProcessor.processedImage();
    await imageProcessor.release();
    return result;
  }
}

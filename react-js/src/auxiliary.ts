
import { ScanbotSdkService } from './service/scanbot-sdk-service';
import Pages from './model/pages';

import { ImageUtils } from './utils/image-utils';
import { MiscUtils } from './utils/misc-utils';

export async function savePDF() {
    const bytes = await ScanbotSdkService.instance.generatePDF(Pages.instance.get());
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".pdf");
}

export async function saveTIFF() {
    const bytes = await ScanbotSdkService.instance.generateTIFF(Pages.instance.get());
    ImageUtils.saveBytes(bytes, MiscUtils.generateUUID() + ".tiff");
}
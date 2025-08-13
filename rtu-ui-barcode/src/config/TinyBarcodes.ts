import { UIConfig } from "scanbot-web-sdk/@types";

export function applyTinyBarcodeConfig(config?: UIConfig.BarcodeScannerScreenConfiguration) {

    if (!config) {
        config = new UIConfig.BarcodeScannerScreenConfiguration();
    }

    config.scannerConfiguration.engineMode = "NEXT_GEN_FAR_DISTANCE";
}

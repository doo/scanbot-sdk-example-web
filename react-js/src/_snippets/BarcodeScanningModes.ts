/**
 * This code snippet is to be used only as a part of the website documentation.
 * It is not intended for any use outside of the support of documentation by Scanbot SDK GmbH employees.
 *
 * For maintainers: whenever changing this code, ensure that links using it are still pointing to valid lines!
 */

import ScanbotSDK from "scanbot-web-sdk/ui";
import { BarcodeScannerViewConfiguration } from "scanbot-web-sdk/@types";
import { ViewFinderConfiguration } from "scanbot-web-sdk/@types/ui2/configuration/common/ViewFinderConfiguration";

// Mock the ScanbotSDK initialization for this snippet
const sdk = await ScanbotSDK.initialize({ licenseKey: "", enginePath: "" });

export class BarcodeScanningModes {

    single(): BarcodeScannerViewConfiguration {
        const config: BarcodeScannerViewConfiguration = {
            containerId: "<SCANNER-CONTAINER-ID>",
            onBarcodesDetected: (result) => {
                console.log("Barcodes detected:", result.barcodes);
                // If you want to scan a single barcode, you'll want to close the scanner after first detection
            }
        }
        config.scannerConfiguration!.returnBarcodeImage = true;

        return config;
    }

    multiple(): BarcodeScannerViewConfiguration {
        const config: BarcodeScannerViewConfiguration = {
            containerId: "<SCANNER-CONTAINER-ID>",
            onBarcodesDetected: (result) => {
                console.log("Barcodes detected:", result.barcodes);
                // In multiple barcode scanning mode, the scanner continues scanning and reporting barcodes
                // until you explicitly stop or dispose it.
            }
        }
        config.scannerConfiguration!.returnBarcodeImage = true;
        if (config.finder?._type === "ViewFinderConfiguration") {
            // Finder type can be persistent or transient, so we need to cast it
            (config.finder as ViewFinderConfiguration).visible = false;
        }
        return config;
    }

    batch(): BarcodeScannerViewConfiguration {
        return {
            containerId: "<SCANNER-CONTAINER-ID>",
            onBarcodesDetected: (result) => {
                console.log("Barcodes detected:", result.barcodes);
                // In batch barcode scanning mode, the scanner continues scanning and reporting barcodes
                // until you explicitly stop or dispose it.
                // You can collect the results into a batch for further processing.
            }
        };
    }

    detectOnStillImages() {
        const fileInput: HTMLInputElement = document.createElement("input");
        fileInput.type = "file";
        fileInput.id = "file-input";
        fileInput.accept = "image/png, image/jpeg";
        fileInput.style.display = "none";

        try {
            if (!fileInput) {
                return;
            }
            fileInput.click();

            fileInput.onchange = async (e: Event) => {
                e.preventDefault();
                const target = e.target as HTMLInputElement;

                const reader = new FileReader();
                const file = target.files?.[0];

                if (file) {
                    reader.readAsDataURL(file);

                    reader.onload = async () => {
                        try {
                            const result = await sdk.detectBarcodes(reader.result as string);

                            if (result.barcodes.length === 0) {
                                alert("No barcodes were detected in your image.");
                            } else {
                                alert(`${result.barcodes.length} barcodes were detected in your image.`);
                            }
                        } catch (error) {
                            alert("Error while detecting barcodes: " + error);
                        }
                    };
                }
            };
            fileInput.remove();

        } catch (error) {
            alert(error);
        }
    }
}

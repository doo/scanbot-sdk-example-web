<template>
  <PageLayout :is-loading="isLoading" title="Barcode Scanner" :hasCameraControls="true" @on-camera-swap="onCameraSwap"
              @on-camera-switch="onCameraSwitch">
    <div id="barcode-scanner-container"></div>
  </PageLayout>
</template>


<script setup lang="ts">
import { inject, onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import * as toastr from "toastr";
import "toastr/build/toastr.min.css";

import ScanbotSDK from "scanbot-web-sdk";
import type { 
  BarcodeFormat, 
  BarcodeItem, 
  BarcodeScannerResultWithSize, 
  BarcodeScannerViewConfiguration, 
  IBarcodeScannerHandle 
} from "scanbot-web-sdk/@types";
import { onError } from "@/misc/onError";

import PageLayout from "@/components/PageLayout.vue";
import { switchCamera } from "@/misc/switchCamera";

const isLoading = ref(true);
const isOverlayScanner = ref(false);
const router = useRouter();
const scanbotSDK: Promise<ScanbotSDK> = inject("scanbotSDK")!;
let barcodeScanner = ref<IBarcodeScannerHandle | null>(null);

onBeforeMount(() => {
  isLoading.value = true;
  isOverlayScanner.value = router.currentRoute.value.params.overlay === "overlay";
})
onMounted(async () => {
  const barcodeFormats: BarcodeFormat[] = [
    "AZTEC",
    "CODABAR",
    "CODE_39",
    "CODE_93",
    "CODE_128",
    "DATA_MATRIX",
    "EAN_8",
    "EAN_13",
    "ITF",
    "MAXI_CODE",
    "PDF_417",
    "QR_CODE",
    "DATABAR",
    "DATABAR_EXPANDED",
    "UPC_A",
    "UPC_E",
    "MSI_PLESSEY",
    "IATA_2_OF_5",
    "INDUSTRIAL_2_OF_5",
    "CODE_25",
    "MICRO_QR_CODE",
    "USPS_INTELLIGENT_MAIL",
    "ROYAL_MAIL",
    "JAPAN_POST",
    "ROYAL_TNT_POST",
    "AUSTRALIA_POST",
    "DATABAR_LIMITED",
    "MICRO_PDF_417",
    "GS1_COMPOSITE",
    "RMQR_CODE",
    "CODE_11",
    "CODE_32",
    "PHARMA_CODE",
    "PHARMA_CODE_TWO_TRACK",
    "PZN_7",
    "PZN_8"
  ];

  const configuration: BarcodeScannerViewConfiguration = {
    onBarcodesDetected: onBarcodesDetected,
    containerId: "barcode-scanner-container",
    detectionParameters: {
      barcodeFormatConfigurations: [
        new ScanbotSDK.Config.BarcodeFormatCommonConfiguration({
          formats: barcodeFormats,
        })
      ]
    },
    onError: onError,
    preferredCamera: 'camera2 0, facing back',
    overlay: {
      visible: isOverlayScanner.value,
      onBarcodeFound: (code: BarcodeItem, polygon) => {
        // You can override onBarcodeFound and create your own implementation for custom styling, e.g.
        // if you wish to only color in certain types of barcodes, you can find and pick them, as demonstrated below:
        if (code.format === "QR_CODE") {
          polygon?.style({ fillColor: "rgba(255, 255, 0, 0.3)", strokeColor: "yellow" })
        }
      }
    },
    finder: { visible: !isOverlayScanner.value },
  };

  try {
    barcodeScanner.value = await (await scanbotSDK).createBarcodeScanner(configuration);
  } catch (e) {
    onError(e);
    await router.push({ name: "home" });
  }

  isLoading.value = false;
});

onBeforeUnmount(async () => {
  if (barcodeScanner.value) {
    barcodeScanner.value.dispose();
    barcodeScanner.value = null;
  }
});

function onCameraSwap() {
  if (barcodeScanner.value) {
    barcodeScanner.value.swapCameraFacing(true);
  }
}

function onCameraSwitch() {
  if (barcodeScanner.value) {
    switchCamera(barcodeScanner.value);
  }
}

async function onBarcodesDetected(result: BarcodeScannerResultWithSize) {
  toastr.success(formatBarcodes(result.barcodes), "Detected Barcodes!");
}

function formatBarcodes(codes: BarcodeItem[]): string {
  return JSON.stringify(
    codes.map((code: BarcodeItem) => {
      if (code.extractedDocument) {
        return code.extractedDocument;
      } else {
        return code.text + " (" + code.format + ") ";
      }
    })
  );
}
</script>
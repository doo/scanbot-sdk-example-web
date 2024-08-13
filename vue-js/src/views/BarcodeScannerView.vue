<template>
  <PageLayout :is-loading="isLoading" title="Barcode Scanner" :hasCameraControls="true" @on-camera-swap="onCameraSwap"
    @on-camera-switch="onCameraSwitch">
    <div id="barcode-scanner-container"></div>
  </PageLayout>
</template>


<script setup lang="ts">
import { useRouter } from "vue-router";
import { inject, onBeforeMount, onMounted, onBeforeUnmount, ref } from "vue";
import PageLayout from "@/components/PageLayout.vue";
import type { BarcodeFormat } from "scanbot-web-sdk/@types/model/barcode/barcode-format";
import type { Barcode, BarcodeResult, BarcodeScannerConfiguration, IBarcodeScannerHandle } from "scanbot-web-sdk/@types";
import { onError } from "@/misc/onError";
import type { IBarcodePolygonHandle } from "scanbot-web-sdk/@types/model/configuration/selection-overlay-configuration";
import type ScanbotSDK from "scanbot-web-sdk";
import * as toastr from "toastr";
import "toastr/build/toastr.min.css";
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
    "ONE_D",
    "AZTEC",
    "CODABAR",
    "CODE_39",
    "CODE_93",
    "CODE_128",
    "DATA_MATRIX",
    "EAN_8",
    "EAN_13", 
    "ITF",
    "MAXICODE",
    "PDF_417",
    "QR_CODE",
    "UPC_A",
    "UPC_E",
    "UPC_EAN_EXTENSION",
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
    "DATABAR",
    "DATABAR_EXPANDED",
    "DATABAR_LIMITED",
    "GS1_COMPOSITE"
  ];


  const configuration: BarcodeScannerConfiguration = {
    onBarcodesDetected: onBarcodesDetected,
    containerId: "barcode-scanner-container",
    barcodeFormats,
    onError: onError,
    preferredCamera: 'camera2 0, facing back',
    overlay: {
      visible: isOverlayScanner.value,
      onBarcodeFound: (code: Barcode, polygon: IBarcodePolygonHandle) => {
        // You can override onBarcodeFound and create your own implementation for custom styling, e.g.
        // if you wish to only color in certain types of barcodes, you can find and pick them, as demonstrated below:
        if (code.format === "QR_CODE") {
          polygon?.style({ fill: "rgba(255, 255, 0, 0.3)", stroke: "yellow" })
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

async function onBarcodesDetected(result: BarcodeResult) {
  toastr.success(formatBarcodes(result.barcodes), "Detected Barcodes!");
}

function formatBarcodes(codes: Barcode[]): string {
  return JSON.stringify(
    codes.map((code: Barcode) => {
      if (code.parsedDocument) {
        return code.parsedDocument;
      } else {
        return code.text + " (" + code.format + ") ";
      }
    })
  );
}
</script>
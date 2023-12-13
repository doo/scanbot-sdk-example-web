<template>
  <PageLayout :is-loading="isLoading" title="Barcode Scanner">
    <div id="barcode-scanner-container"></div>
  </PageLayout>
</template>


<script setup lang="ts">
import {useRouter} from "vue-router";
import {inject, onBeforeMount, onMounted, ref} from "vue";
import PageLayout from "@/components/PageLayout.vue";
import type {BarcodeFormat} from "scanbot-web-sdk/@types/model/barcode/barcode-format";
import type {Barcode, BarcodeResult, BarcodeScannerConfiguration} from "scanbot-web-sdk/@types";
import {onError} from "@/misc/onError";
import type {IBarcodePolygonHandle} from "scanbot-web-sdk/@types/model/configuration/selection-overlay-configuration";
import type ScanbotSDK from "scanbot-web-sdk";
import * as toastr from "toastr";
import "toastr/build/toastr.min.css";

const isLoading = ref(true);
const isOverlayScanner = ref(false);
const router = useRouter();
const scanbotSDK: Promise<ScanbotSDK> = inject("scanbotSDK")!;

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
    "MAXICODE",
    "PDF_417",
    "QR_CODE",
    "RSS_14",
    "RSS_EXPANDED",
    "UPC_A",
    "UPC_E",
    "UPC_EAN_EXTENSION",
    "MSI_PLESSEY",
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
          polygon.style({fill: "rgba(255, 255, 0, 0.3)", stroke: "yellow"})
        }
      }
    },
    showFinder: !isOverlayScanner.value,
  };

  try {
    await (await scanbotSDK).createBarcodeScanner(configuration);
  } catch (e) {
    onError(e);
    await router.push({name: "home"});
  }

  isLoading.value = false;
});

async function onBarcodesDetected(result: BarcodeResult) {
  toastr.success(formatBarcodes(result.barcodes), "Detected Barcodes!");
}

function formatBarcodes(codes: Barcode[]): string {
  return JSON.stringify(
      codes.map((code: Barcode) => {
        if (code.parsedText) {
          return code.parsedText;
        } else {
          return code.text + " (" + code.format + ") ";
        }
      })
  );
}
</script>
<template>
  <PageLayout title="Document Scanner" :is-loading=isLoading :hasCameraControls="true" @on-camera-swap="onCameraSwap"
    @on-camera-switch="onCameraSwitch">
    <div id="scanbot-document-scanner-ui-container" class="scanbot-camera-container"></div>
    <div class="bottom-bar">
      <div class="bottom-bar-button scanner-page-counter" v-html="numPages()"></div>
      <div class="align-right-bottom-bar-button">
        <RouterLink :to="{ name: 'document_list' }">
          <button class="bottom-bar-button scanner-done">
            DONE
          </button>
        </RouterLink>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from "@/components/PageLayout.vue";
import { inject, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import type ScanbotSDK from "scanbot-web-sdk";
import type { IDocumentScannerHandle, DocumentDetectionResult } from "scanbot-web-sdk/@types";
import { RouterLink, useRouter } from "vue-router";
import { useDocumentsStore } from "@/stores/documents.js";
import { onError } from "@/misc/onError";
import { switchCamera } from "@/misc/switchCamera";
import { swalAlert } from "@/misc/swalAlert";

let isLoading = ref(true);
let documentScanner = ref<IDocumentScannerHandle | null>(null);
const router = useRouter();
const documentsStore = useDocumentsStore();

function numPages() {
  return documentsStore.documents.length + ' pages';
}

onBeforeMount(() => {
  isLoading.value = true;
});

onMounted(async () => {
  const scanbotSDK: ScanbotSDK = await inject("scanbotSDK")!;

  const config = {
    containerId: 'scanbot-document-scanner-ui-container',
    acceptedAngleScore: 60,
    acceptedSizeScore: 60,
    autoCaptureSensitivity: 0.66,
    autoCaptureEnabled: true,
    ignoreBadAspectRatio: false,
    style: {
      // Note that alternatively, styling the document scanner is also possible using CSS classes.
      // For details see https://docs.scanbot.io/document-scanner-sdk/web/features/document-scanner/document-scanner-ui/
      outline: {
        polygon: {
          strokeWidth: 5,
          fillCapturing: "rgba(0, 255, 0, 0.2)",
          strokeCapturing: "green",
          fillSearching: "rgba(255, 0, 0, 0.2)",
          strokeSearching: "red",
        }
      }
    },
    onDocumentDetected: (result: DocumentDetectionResult) => {
      scanbotSDK.utils.flash();
      documentsStore.addDocument(result);
    },
    onError: onError,
    text: {
      hint: {
        OK: "Capturing your document...",
        OK_SmallSize: "The document is too small. Try moving closer.",
        OK_BadAngles:
          "This is a bad camera angle. Hold the device straight over the document.",
        OK_BadAspectRatio:
          "Rotate the device sideways, so that the document fits better into the screen.",
        OK_OffCenter: "Try holding the device at the center of the document.",
        Error_NothingDetected:
          "Please hold the device over a document to start scanning.",
        Error_Brightness: "It is too dark. Try turning on a light.",
        Error_Noise: "Please move the document to a clear surface.",
      },
    },
    preferredCamera: 'camera2 0, facing back'
  };

  try {
    documentScanner.value = await scanbotSDK.createDocumentScanner(config);
  } catch (e: any) {
    await swalAlert(e.name + ': ' + e.message);
    await router.push({ name: 'home' });
  }
  isLoading.value = false;
});

onBeforeUnmount(async () => {
  if (documentScanner.value) {
    documentScanner.value.dispose();
    documentScanner.value = null;
  }
});

function onCameraSwap() {
  console.log("onCameraSwap")
  if (documentScanner.value) {
    documentScanner.value.swapCameraFacing(true);
  }
}

function onCameraSwitch() {
  if (documentScanner.value) {
    switchCamera(documentScanner.value);
  }
}
</script>

<style></style>

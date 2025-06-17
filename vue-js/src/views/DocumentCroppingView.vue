<template>
  <PageLayout title="Crop Scanned Document" :is-loading="isLoading" :back-button-target="detailViewRouteTarget">
    <div id="cropping-view-container"></div>

    <div class="bottom-bar">
      <button class="bottom-bar-button detect" @click="onCroppingClick()">
        DETECT
      </button>
      <button class="bottom-bar-button rotate" @click="onRotateClick()">
        ROTATE
      </button>
      <div class="align-right-bottom-bar-button">
        <button class="bottom-bar-button apply" @click="onApplyClick()">
          APPLY
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">

import { inject, onBeforeMount, onBeforeUnmount, onMounted, ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import ScanbotSDK from "scanbot-web-sdk";
import type { CroppingViewConfiguration, ICroppingViewHandle } from "scanbot-web-sdk/@types";

import PageLayout from "@/components/PageLayout.vue";
import { type Document, type DocumentContent, useDocumentsStore } from "@/stores/documents";
import { swalAlert } from "@/misc/swalAlert";
import { Filters } from "@/misc/Filters";

const router = useRouter();
const documents = useDocumentsStore();

const document = ref<Document>();
const isLoading = ref(true);
const croppingView = ref<ICroppingViewHandle>();
const detailViewRouteTarget = ref({ name: 'document_detail', params: { id: router.currentRoute.value.params.id } });
const scanbot = ref<ScanbotSDK>();

onBeforeMount(() => {
  isLoading.value = true;
});

onMounted(async () => {

  scanbot.value = await inject("scanbotSDK")!;
  document.value = documents.getDocumentById(Number(router.currentRoute.value.params.id));

  if (!document.value) {
    await swalAlert("Document not found!");
    await router.push({ name: 'home' });
    return;
  }
  const raw = toRaw(document.value.content);
  
  const options: CroppingViewConfiguration = {
    containerId: "cropping-view-container",
    image: raw.original,
    polygon: raw.polygon,
    disableScroll: true,
    rotations: raw.rotations ?? 0,
    style: {
      padding: 0,
      polygon: {
        color: "green",
        width: 4,
        handles: {
          size: 14,
          color: "white",
          border: "1px solid lightgray",
        },
      },
      magneticLines: {
        color: "red",
      },
    },
  };

  croppingView.value = await scanbot.value!.openCroppingView(options);
  isLoading.value = false;
});

onBeforeUnmount(() => {
  croppingView.value?.dispose();
});

async function onCroppingClick() {
  isLoading.value = true;

  await croppingView.value?.detect();
  isLoading.value = false;
}

async function onRotateClick() {
  isLoading.value = true;
  await croppingView.value?.rotate(1);
  isLoading.value = false;
}

async function onApplyClick() {
  const croppingResult = await toRaw(croppingView.value)?.apply();
  document.value!.content.cropped = croppingResult?.image;
  document.value!.content.polygon = croppingResult?.polygon;
  if (document.value!.content.filter && document.value!.content.filter != "none") {
    document.value!.content.filtered = await Filters.applyFilter(
      scanbot.value!,
      toRaw(document.value!.content.cropped!),
      document.value!.content.filter
    );
  }
  await router.push(detailViewRouteTarget.value);
}
</script>

<style>
#cropping-view-container {
  margin-top: 68px;
  width: 100%;
  height: calc(100% - 50px);
}
</style>
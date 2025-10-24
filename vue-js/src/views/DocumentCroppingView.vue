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
import { type ScanbotDocument, DocumentStore } from "@/stores/documents";
import { swalAlert } from "@/misc/swalAlert";
import { Filters } from "@/misc/Filters";

const router = useRouter();

let document: ScanbotDocument | undefined;
const isLoading = ref(true);
const croppingView = ref<ICroppingViewHandle>();
const detailViewRouteTarget = ref({ name: 'document_detail', params: { id: router.currentRoute.value.params.id } });
const scanbot = ref<ScanbotSDK>();

onBeforeMount(() => {
  isLoading.value = true;
});

onMounted(async () => {

  scanbot.value = await inject("scanbotSDK")!;
  document = DocumentStore.instance.getDocumentById(Number(router.currentRoute.value.params.id));

  if (!document) {
    await swalAlert("Document not found!");
    await router.push({ name: 'home' });
    return;
  }
  const raw = toRaw(document.content);
  
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
  document!.content.cropped = croppingResult?.image;
  document!.content.polygon = croppingResult?.polygon;
  if (document!.content.filter && document!.content.filter != "none") {
    document!.content.filtered = await Filters.applyFilter(
      scanbot.value!,
      toRaw(document!.content.cropped!),
      document!.content.filter
    );
  }
  await DocumentStore.instance.updateDataUrl(document!, scanbot.value!);
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
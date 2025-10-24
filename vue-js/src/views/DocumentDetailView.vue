<template>
  <PageLayout title="Scanned Page" :back-button-target="{ name: 'document_list' }">
    <div class="content-container">
      <img :key="imageKey" class="detail-image" :src="document?.dataUrl" alt="Scanned Page" />
    </div>

    <div class="bottom-bar">
      <button class="bottom-bar-button open-cropping-view" @click="openCroppingView()">
        CROP
      </button>
      <button class="bottom-bar-button apply-filter" @click="onFilterClick()">
        FILTER
      </button>

      <div class="align-right-bottom-bar-button">
        <button class="bottom-bar-button delete-button" @click="deleteActiveItem()">
          DELETE
        </button>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, ref } from "vue";
import ScanbotSDK from "scanbot-web-sdk";
import PageLayout from "@/components/PageLayout.vue";
import { onBeforeRouteUpdate, type RouteParamsRaw, useRouter } from "vue-router";
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import { Filters } from "@/misc/Filters";
import { swalAlert } from "@/misc/swalAlert";
import { DocumentStore, type ScanbotDocument } from "@/stores/documents";

const router = useRouter();
const scanbotSDK: Promise<ScanbotSDK> = inject("scanbotSDK")!;

let document: ScanbotDocument | undefined;
let imageKey = ref(0);

onBeforeMount(async () => {
  document = DocumentStore.instance.getDocumentById(Number(router.currentRoute.value.params.id));
  if (!document) {
    await swalAlert("Document not found!");
    await router.push({ name: 'home' });
    return;
  }
  await DocumentStore.instance.updateDataUrl(document, await scanbotSDK);
});

function deleteActiveItem() {
  DocumentStore.instance.removeDocument(document!);
  router.push({ name: 'document_list' });
}

async function openCroppingView() {
  await router.push({ name: 'document_cropping', params: { id: document!.id } });
}

async function onFilterClick() {
  console.log("document.value", document)
  const result = await Swal.fire({
    title: "Select filter",
    input: "select",
    inputOptions: Filters.availableFilters,
    inputValue: document?.content.filter ?? "none",
  });

  const filter = Filters.availableFilters[result.value];

  if (filter === "none") {
    document!.content.filter = undefined;
    document!.content.filtered = undefined;
  } else {
    document!.content.filter = filter;
    document!.content.filtered = await Filters.applyFilter(
      await scanbotSDK,
      document!.content.cropped ?? document!.content.original,
      filter
    );
  }

  await DocumentStore.instance.updateDataUrl(document!, await scanbotSDK);
  imageKey.value += 1;
}
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.content-container {
  margin-top: 68px;
  width: 100%;
  height: calc(100% - 50px);
}
</style>

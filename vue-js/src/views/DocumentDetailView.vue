<template>
  <PageLayout title="Scanned Page" :back-button-target="{ name: 'document_list' }">
    <div class="content-container">
      <img class="detail-image" :src="document?.dataUrl" alt="Scanned Page" />
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
import { type Document, useDocumentsStore } from "@/stores/documents";
import { inject, onBeforeMount, ref } from "vue";
import ScanbotSDK from "scanbot-web-sdk";
import PageLayout from "@/components/PageLayout.vue";
import { useRouter } from "vue-router";
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'
import { Filters } from "@/misc/Filters";
import type { ImageFilter } from "scanbot-web-sdk/@types";
import { swalAlert } from "@/misc/swalAlert";

const router = useRouter();
const documents = useDocumentsStore();
const scanbotSDK: Promise<ScanbotSDK> = inject("scanbotSDK")!;

const document = ref<Document>();

onBeforeMount(async () => {
  document.value = documents.getDocumentById(Number(router.currentRoute.value.params.id));
  if (!document.value) {
    await swalAlert("Document not found!");
    await router.push({ name: 'home' });
    return;
  }
  await documents.updateDataUrl(document.value, await scanbotSDK);
});

function deleteActiveItem() {
  documents.removeDocument(document.value!);
  router.push({ name: 'document_list' });
}

function openCroppingView() {
  router.push({ name: 'document_cropping', params: { id: document.value!.id } });
}

async function onFilterClick() {
  console.log(document.value)
  const result = await Swal.fire({
    title: "Select filter",
    input: "select",
    inputOptions: Filters.availableFilters(),
    inputValue: document.value?.content.filter ?? "none",
  });

  const filter = Filters.availableFilters()[result.value];

  if (filter === "none") {
    document.value!.content.filter = undefined;
    document.value!.content.filtered = undefined;
  } else {
    document.value!.content.filter = filter;
    document.value!.content.filtered = await Filters.applyFilter(
      await scanbotSDK,
      document.value!.content.cropped ?? document.value!.content.original,
      filter
    );
  }

  await documents.updateDataUrl(document.value!, await scanbotSDK);
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

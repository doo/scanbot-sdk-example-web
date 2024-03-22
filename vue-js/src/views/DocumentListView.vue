<template>
  <PageLayout title="Scanned Document Pages" :is-loading="isLoading">
    <div class="content-container">
      <ul>
        <li class="document p-1" v-for="doc in documentsStore.documents" :key="doc.id">
          <RouterLink :to="{ name: 'document_detail', params: { id: doc.id } }">
            <img :src="doc.dataUrl" alt="Captured Document" />
          </RouterLink>
        </li>
      </ul>

      <h4 class="nothing-to-display-hint" v-if="documentsStore.documents.length === 0">
        Nothing to display. Scan or import some documents!
      </h4>
    </div>

    <div class="bottom-bar">
      <button class="bottom-bar-button save-pdf" @click="download('pdf')">
        SAVE PDF
      </button>
      <button class="bottom-bar-button save-tiff ml-3" @click="download('tiff')">
        SAVE TIFF
      </button>
    </div>
  </PageLayout>
</template>


<script setup lang="ts">

import { useDocumentsStore } from "@/stores/documents";
import PageLayout from "@/components/PageLayout.vue";
import { inject, onBeforeMount, ref } from "vue";
import ScanbotSDK from "scanbot-web-sdk";
import fileDownload from "js-file-download";
import { RouterLink } from "vue-router";
import { swalAlert } from "@/misc/swalAlert";
import { Filters } from "@/misc/Filters";

const documentsStore = useDocumentsStore();
const scanbotSDK: Promise<ScanbotSDK> = inject("scanbotSDK")!;
const isLoading = ref(true);

onBeforeMount(async () => {
  isLoading.value = true;
  console.log('onBeforeMount in DocumentDetailView')
  await documentsStore.updateDataUrls(await scanbotSDK);
  isLoading.value = false;
});

async function download(type: "pdf" | "tiff") {
  if (documentsStore.documents.length === 0) {
    await swalAlert("Please scan or import some documents first!");
    return;
  }

  isLoading.value = true;
  const createGenerator = {
    pdf: async () => {
      return (await scanbotSDK).beginPdf({
        standardPaperSize: "A4",
        pageDirection: "PORTRAIT"
      });
    },
    tiff: async () => {
      return (await scanbotSDK).beginTiff({
        dpi: 123,
      });
    }
  };
  const generator = await createGenerator[type]();

  for (const doc of documentsStore.documents) {
    let page = doc.content.filtered ?? doc.content.cropped ?? doc.content.original;
    if (type === "tiff") {
      page = await Filters.applyFilter(await scanbotSDK, page, "ScanbotBinarizationFilter");
    }
    await generator.addPage(page);
  }
  const result: ArrayBuffer = await generator.complete();
  fileDownload(result, "scanbotSDK-document." + type, "application/" + type);

  isLoading.value = false;
}
</script>


<style scoped>
.document {
  list-style-type: none;
  float: left;
  max-width: 150px;
  height: 150px;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-container {
  margin-top: 68px;
  width: 100%;
  height: calc(100% - 50px);
  overflow-y: scroll;
}

.nothing-to-display-hint {
  text-align: center;
}
</style>
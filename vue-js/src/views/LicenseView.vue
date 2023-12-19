<template>
  <PageLayout title="License Info" :is-loading=false>
    <p class="m-3">
      License:
    </p>
    <p class="m-3" v-html="licenseText"></p>
  </PageLayout>
</template>

<script setup lang="ts">

import { inject, ref, onBeforeMount } from "vue";
import PageLayout from "@/components/PageLayout.vue";
import type ScanbotSDK from "scanbot-web-sdk";

const licenseText = ref();

onBeforeMount(async () => {
  licenseText.value = "Loading...";
  const scanbotSDK: ScanbotSDK = await inject("scanbotSDK")!;
  const info = await scanbotSDK.getLicenseInfo();
  licenseText.value = JSON.stringify(info, null, " ");
  licenseText.value = licenseText.value.replace(/\n/g, "<br/>");
});

</script>

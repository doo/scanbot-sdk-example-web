<template>
  <PageLayout title="License Info" :is-loading=false>
    <p class="m-3">
      License: <br>
      <pre>{{ text }}</pre>
    </p>
  </PageLayout>
</template>

<script setup lang="ts">

import {inject, ref, onBeforeMount} from "vue";
import PageLayout from "@/components/PageLayout.vue";
import type ScanbotSDK from "scanbot-web-sdk";

const text = ref();

onBeforeMount(async () => {
  text.value = "Loading...";
  const scanbotSDK:ScanbotSDK = await inject("scanbotSDK")!;
  const info = await scanbotSDK.getLicenseInfo();
  text.value = JSON.stringify(info);
});

</script>
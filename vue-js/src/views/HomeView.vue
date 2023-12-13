<script setup lang="ts">
import {RouterLink} from "vue-router";
import PageLayout from "@/components/PageLayout.vue";
</script>

<template>
  <PageLayout title="Scanbot Web SDK" :back-button-target="{}">
    <ul>
      <li><RouterLink to="/document_scanner" class="main-list-item document-scanner-button">Document Scanner</RouterLink></li>
      <li><RouterLink :to="{name: 'document_list'}" class="main-list-item scanner-results-button">Document Results</RouterLink></li>
      <li><RouterLink :to="{name: 'license'}" class="main-list-item license-info-button">License Info</RouterLink></li>
    </ul>
  </PageLayout>
</template>

<style scoped>
ul {
  padding-inline-start: 0;
}

li {
  width: 100%;
  height: 45px;
  border-bottom: 1px solid lightgray;
  line-height: 45px;
  list-style-type: none;
  font-weight: 500;
  padding-left: 10px;
}

.main-list-item{
  text-decoration: none;
  color: black;
}
</style>
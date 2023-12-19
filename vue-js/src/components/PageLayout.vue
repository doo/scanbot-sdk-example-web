<template>
  <div>
    <div class="navbar navbar-dark" role="banner">
      <div class="navbar-brand mb-0 h3">
        <span class="back-button">
          <router-link v-if="'name' in backButtonTarget" :to="backButtonTarget">&#8249;</router-link>
        </span>
        <span class="main-title">{{ title }}</span>
      </div>
      <div class="spacer"></div>
      <div v-if="hasCameraControls" class="camera-button-container h3">
        <span class="camera-swap-button mr-3" @click="$emit('on-camera-swap')">&#8645;</span>
        <span class="camera-switch-button mr-3" @click="$emit('on-camera-switch')">&#8646;</span>
      </div>
    </div>
    <div id="barcode-scanner-container" class="content" role="main" :style="isLoading ? {display:'none'} : {}">
      <slot></slot>
    </div>
    <div class="content loading-screen" v-if="isLoading">
      <div class="spinner-border mt-3" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  isLoading: {
    type: Boolean,
    default: false
  },
  hasCameraControls: {
    type: Boolean,
    default: false
  },
  backButtonTarget: {
    type: Object,
    default: () => {
      return {name: 'home'}
    }
  }
});
</script>

<style>
.navbar {
  position: absolute;
  z-index: 500;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  background-color: #c8193c;
  color: white;
  font-weight: 600;
  padding-left: 20px;
}

.spacer {
  flex-grow: 1;
}

.content {
  margin-top: calc(8px + 60px);
  height: calc(100vh - (2 * 8px + 60px));
  width: calc(100vw - 16px);
  margin-left: 8px;
}

.back-button {
  display: inline-block;
  width: 30px;
}

.back-button a {
  font-size: 25px;
  color: white;
  text-decoration: none;
}

.back-button, .main-title {
  vertical-align: middle;
}

.navbar-brand {
  line-height: 25px;
}

.camera-swap-button {
  height: 50px;
  width: 50px;
  line-height: 50px;
  font-size: 25px;
  text-align: center;
}

.loading-screen {
  text-align: center;
}
</style>

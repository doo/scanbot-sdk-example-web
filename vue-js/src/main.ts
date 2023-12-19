import {createApp} from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ScanbotSDK from "scanbot-web-sdk";

import './assets/main.css'

const app = createApp(App)

// The path to the Scanbot SDK WebAssembly modules is made available by the static-copy plugin,
// which is configured in the vite.config.ts file.
const enginePath = "/scanbot-web-sdk/";
const scanbotSDK = ScanbotSDK.initialize({ licenseKey: "", engine: enginePath });
app.provide("scanbotSDK", scanbotSDK);

app.use(createPinia())
app.use(router)

app.mount('#app');

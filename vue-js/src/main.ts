import {createApp} from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ScanbotSDK from "scanbot-web-sdk";

import './assets/main.css'

const app = createApp(App)

const scanbotSDK = ScanbotSDK.initialize({ licenseKey: "", engine: "/scanbot-web-sdk/" });
app.provide("scanbotSDK", scanbotSDK);

app.use(createPinia())
app.use(router)

app.mount('#app');

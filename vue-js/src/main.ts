import {createApp} from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ScanbotSDK from "scanbot-web-sdk";

import './assets/main.css'

const app = createApp(App)

/*
 * TODO add the license key here.
 * Please note: The Scanbot Web SDK will run without a license key for one minute per session!
 * After the trial period has expired, all SDK functions and UI components will stop working.
 * You can get a free "no-strings-attached" trial license.
 * Please submit the trial license form (https://scanbot.io/trial/) on our website using
 * "Web SDK" as the license type and a corresponding domain name of your test environment 
 * (e.g. myapp.example.com or www.mywebsite.com). Every trial license automatically 
 * includes "localhost" as a domain name for local development purposes.
 */
const LICENSE_KEY = "";

// The path to the Scanbot SDK WebAssembly modules is made available by the static-copy plugin,
// which is configured in the vite.config.ts file.
const enginePath = "/scanbot-web-sdk/";
const scanbotSDK = ScanbotSDK.initialize({ licenseKey: LICENSE_KEY, engine: enginePath });
app.provide("scanbotSDK", scanbotSDK);

app.use(createPinia())
app.use(router)

app.mount('#app');

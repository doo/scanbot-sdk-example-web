import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import {viteStaticCopy} from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteStaticCopy({
      // Make the files necessary for running the Scanbot SDK WebAssembly modules available as static files
      targets: [
        {
          src: 'node_modules/scanbot-web-sdk/bundle/bin/complete/*',
          dest: 'scanbot-web-sdk',
        }
      ],
      structured: false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
})

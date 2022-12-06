import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs';

export default defineConfig({
  plugins: [svelte()],
  https: {
    key: fs.readFileSync('RootCA-key.pem'),
    cert: fs.readFileSync('RootCA.pem')
  }
})

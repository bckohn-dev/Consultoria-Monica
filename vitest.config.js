import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'jsdom',
        globals: true,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)) // ⬅️ isso resolve o alias "@"
        }
    }
})
// This configuration file sets up Vitest for testing a Vue.js application.
// It includes the Vue plugin for handling Vue files and configures the test environment to use jsdom, which is suitable for testing web applications.
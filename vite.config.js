import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path';
// import { visualizer } from "rollup-plugin-visualizer";
// import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig({
    plugins: [
        vue({
            // template: { transformAssetUrls }
        }),
        // visualizer({ template: "list" }),
        // quasar({
        //     sassVariables: 'src/quasar-variables.sass'
        // }),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @import "@/assets/styles/global.scss";
                `,
            }
        }
    },
    server: {
        port: 8080,
    },
})

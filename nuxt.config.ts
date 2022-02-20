import { defineNuxtConfig } from 'nuxt3'
import postcssConfig from './postcss.config'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
    css: [
        '@/assets/css/main.css',
    ],
    build: {
        postcss: {
          postcssOptions: postcssConfig,
        },
    },
    meta:{
        link: [
            {rel: 'icon', href: "/favicon.png", type: "image"}
        ]
    },
    buildModules: [
        '@pinia/nuxt',
    ],
    head:{
        script: [
            {
                "data-ad-client": "ca-pub-3135078613883761",
                defer: true,
                src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            }
        ]
    }
})

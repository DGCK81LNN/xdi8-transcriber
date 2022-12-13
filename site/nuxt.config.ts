export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  app: {
    baseURL: "/xdi8-transcriber/",
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: { lang: "zh-cmn-Hans" },
      meta: [
        { name: "format-detection", content:"telephone=no" },
      ],
    },
  },
  ssr: true,
})

import { defineNuxtPlugin } from "#app"

import BootstrapVueNext from "bootstrap-vue-next"

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(BootstrapVueNext)
})

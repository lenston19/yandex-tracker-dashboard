import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin(nuxtApp => {
  // @ts-expect-error
  nuxtApp.vueApp.use(VueApexCharts)
})

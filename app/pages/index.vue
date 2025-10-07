<script setup lang="ts">
import WeekTimeWidget from '~/components/widgets/WeekTimeWidget.vue'
import DayTimeWidget from '~/components/widgets/DayTimeWidget.vue'
import MonthTimeWidget from '~/components/widgets/MonthTimeWidget.vue'
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
  title: SITEMAP.main.name
})

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <week-time-widget class="order-3 col-span-4 h-fit md:order-1" />
    <day-time-widget class="order-1 col-span-4 h-fit md:order-2 md:col-span-2" />
    <month-time-widget class="order-2 col-span-4 h-fit md:order-3 md:col-span-2" />
  </div>
</template>

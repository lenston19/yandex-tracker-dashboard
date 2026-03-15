<script setup lang="ts">
import WeekTimeWidget from '../components/week-time-widget.vue'
import DayTimeWidget from '../components/day-time-widget.vue'
import MonthTimeWidget from '../components/month-time-widget.vue'
import ActivityHeatmapWidget from '../components/activity-heatmap-widget.vue'
import { SITEMAP } from '~/core/utils/router/sitemap/index'
import { useSiteSettingsStore } from '~/modules/settings'

useHead({ title: SITEMAP.main.name })

const { heatmap } = storeToRefs(useSiteSettingsStore())
</script>

<template>
  <div class="grid grid-cols-4 gap-4">
    <week-time-widget class="order-3 col-span-4 md:order-1" />
    <day-time-widget class="order-1 col-span-4 md:order-2 md:col-span-2" />
    <month-time-widget class="order-2 col-span-4 md:order-3 md:col-span-2" />
    <activity-heatmap-widget
      v-if="heatmap.show"
      class="order-4 col-span-4"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import WeekTimeWidget from '../components/week-time-widget.vue'
import DayTimeWidget from '../components/day-time-widget.vue'
import MonthTimeWidget from '../components/month-time-widget.vue'
import HolidayWidget from '../components/holiday-widget.vue'
import { useSiteSettingsStore } from '~/modules/settings'
import { useIsMobile } from '~/core/composables/use-is-mobile'

const ActivityHeatmapWidget = defineAsyncComponent(() => import('../components/activity-heatmap-widget.vue'))
const MyIssuesWidget = defineAsyncComponent(() => import('../components/my-issues-widget.vue'))

const { heatmap, myIssues, seasonalTheme } = storeToRefs(useSiteSettingsStore())

const layout = computed(() => {
  const left: Component[] = [DayTimeWidget, MonthTimeWidget]
  const right: Component[] = []
  const top: Component[] = [WeekTimeWidget]

  if (seasonalTheme.value.active) {
    left.unshift(HolidayWidget)
  }

  if (myIssues.value.show) {
    right.push(MyIssuesWidget)
  }

  if (heatmap.value.show) {
    right.push(ActivityHeatmapWidget)
  }

  return { top, left, right }
})

const mobileOrder = computed(() => {
  const list: Component[] = [WeekTimeWidget]

  if (seasonalTheme.value.active) {
    list.push(HolidayWidget)
  }

  list.push(DayTimeWidget, MonthTimeWidget)

  if (myIssues.value.show) {
    list.push(MyIssuesWidget)
  }

  if (heatmap.value.show) {
    list.push(ActivityHeatmapWidget)
  }

  return list
})

const isMobile = useIsMobile()
</script>

<template>
  <div
    v-if="isMobile"
    class="flex flex-col gap-4 md:hidden"
  >
    <component
      :is="comp"
      v-for="(comp, i) in mobileOrder"
      :key="'m-' + i"
    />
  </div>

  <div
    v-else
    class="hidden grid-cols-2 gap-4 md:grid"
  >
    <component
      :is="comp"
      v-for="(comp, i) in layout.top"
      :key="'top-' + i"
      class="col-span-2"
    />

    <div
      class="flex flex-col gap-4"
      :class="{ 'col-span-2': layout.right.length === 0 }"
    >
      <component
        :is="comp"
        v-for="(comp, i) in layout.left"
        :key="'left-' + i"
      />
    </div>

    <div
      v-if="layout.right.length"
      class="flex flex-col gap-4"
    >
      <component
        :is="comp"
        v-for="(comp, i) in layout.right"
        :key="'right-' + i"
      />
    </div>
  </div>
</template>

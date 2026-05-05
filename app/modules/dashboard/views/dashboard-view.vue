<script setup lang="ts">
import { computed, defineAsyncComponent, type Component } from 'vue'
import WeekTimeWidget from '../components/week-time-widget.vue'
import DayTimeWidget from '../components/day-time-widget.vue'
import MonthTimeWidget from '../components/month-time-widget.vue'
import { useSiteSettingsStore } from '~/modules/settings'
import { useIsMobile } from '~/core/composables/use-is-mobile'

const ActivityHeatmapWidget = defineAsyncComponent(() => import('../components/activity-heatmap-widget.vue'))
const MyIssuesWidget = defineAsyncComponent(() => import('../components/my-issues-widget.vue'))

const { heatmap, myIssues } = storeToRefs(useSiteSettingsStore())

const layout = computed(() => {
  const left: Component[] = []
  const right: Component[] = []

  const top: Component[] = [WeekTimeWidget]

  if (myIssues.value.show) {
    left.push(DayTimeWidget, MonthTimeWidget)

    if (heatmap.value.show) {
      left.push(ActivityHeatmapWidget)
    }

    right.push(MyIssuesWidget)
  } else {
    left.push(DayTimeWidget)

    if (heatmap.value.show) {
      left.push(ActivityHeatmapWidget)
    }

    right.push(MonthTimeWidget)
  }

  return { top, left, right }
})

const mobileOrder = computed(() => {
  const list: Component[] = []

  list.push(DayTimeWidget)
  list.push(MonthTimeWidget)
  list.push(WeekTimeWidget)

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
    class="flex flex-col gap-3 md:hidden"
  >
    <component
      :is="comp"
      v-for="(comp, i) in mobileOrder"
      :key="'m-' + i"
    />
  </div>

  <div
    v-else
    class="hidden grid-cols-2 gap-3 md:grid"
  >
    <component
      :is="comp"
      v-for="(comp, i) in layout.top"
      :key="'top-' + i"
      class="col-span-2"
    />

    <div class="flex flex-col gap-3">
      <component
        :is="comp"
        v-for="(comp, i) in layout.left"
        :key="'left-' + i"
      />
    </div>

    <div class="flex flex-col gap-3">
      <component
        :is="comp"
        v-for="(comp, i) in layout.right"
        :key="'right-' + i"
      />
    </div>
  </div>
</template>

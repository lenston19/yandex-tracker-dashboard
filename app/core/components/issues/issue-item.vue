<script setup lang="ts">
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { getPriorityWeight, getStatusColor } from '~/core/utils/my-issues'
import { HEROICONS } from '~/core/constants/heroicons'

const props = withDefaults(
  defineProps<{
    issue: Yandex.Issue
    display?: {
      priority?: boolean
      status?: boolean
      assignee?: boolean
      reviewer?: boolean
      qaEngineer?: boolean
    }
  }>(),
  {
    display: () => ({
      priority: true,
      status: true,
      assignee: false,
      reviewer: false,
      qaEngineer: false
    })
  }
)

interface ChevronConfig {
  icon: string
  color: string
  count: number
  tooltip: string
}

const chevrons = computed((): ChevronConfig => {
  const w = getPriorityWeight(props.issue)
  const label = props.issue.priority?.display ?? ''
  if (w === 0) return { icon: HEROICONS.CHEVRON_DOUBLE_UP, color: 'text-red-500', count: 3, tooltip: label }
  if (w === 1) return { icon: HEROICONS.CHEVRON_UP_20_SOLID, color: 'text-orange-400', count: 2, tooltip: label }
  if (w === 2) return { icon: HEROICONS.CHEVRON_UP_20_SOLID, color: 'text-blue-400', count: 1, tooltip: label }
  return { icon: HEROICONS.CHEVRON_DOWN, color: 'text-neutral-500', count: 1, tooltip: label }
})

const statusColor = computed(() => getStatusColor(props.issue.status))

const hasMeta = computed(
  () =>
    (props.display.assignee && props.issue.assignee) ||
    (props.display.reviewer && props.issue.reviewer) ||
    (props.display.qaEngineer && props.issue.qaEngineer)
)
</script>

<template>
  <div class="flex justify-between gap-3 py-2.5">
    <div class="flex min-w-0 flex-1 flex-col items-start">
      <div class="flex flex-wrap items-center gap-1.5">
        <u-tooltip
          v-if="display.priority !== false"
          :text="chevrons.tooltip"
          :delay-duration="200"
        >
          <span class="inline-flex cursor-default items-center">
            <u-icon
              v-for="n in chevrons.count"
              :key="n"
              :name="chevrons.icon"
              :class="['-mx-0.5 size-3.5', chevrons.color]"
            />
          </span>
        </u-tooltip>

        <u-link
          :to="`https://tracker.yandex.ru/${issue.key}`"
          target="_blank"
          class="font-mono text-xs text-primary hover:underline"
        >
          {{ issue.key }}
        </u-link>

        <u-badge
          v-if="display.status !== false"
          :label="issue.status.display"
          :color="statusColor"
          variant="subtle"
          size="sm"
        />
      </div>

      <div class="mt-0.5 max-w-full truncate text-left text-sm text-wrap">{{ issue.summary }}</div>

      <div
        v-if="hasMeta"
        class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-neutral-500"
      >
        <span v-if="display.assignee && issue.assignee">
          <span class="text-neutral-600">Исп:</span> {{ issue.assignee.display }}
        </span>
        <span v-if="display.reviewer && issue.reviewer">
          <span class="text-neutral-600">Ревью:</span> {{ issue.reviewer.display }}
        </span>
        <span v-if="display.qaEngineer && issue.qaEngineer">
          <span class="text-neutral-600">QA:</span> {{ issue.qaEngineer.display }}
        </span>
      </div>
    </div>

    <slot name="action" />
  </div>
</template>

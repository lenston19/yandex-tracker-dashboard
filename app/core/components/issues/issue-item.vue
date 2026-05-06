<script setup lang="ts">
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'
import { getPriorityWeight, getStatusColor } from '~/core/utils/my-issues'
import { highlightText } from '~/core/utils/text'
import { HEROICONS } from '~/core/constants/heroicons'
import { useTimerStore } from '~/core/store/use-timer-store'

const props = withDefaults(
  defineProps<{
    issue: Yandex.Issue
    highlightQuery?: string
    display?: {
      priority?: boolean
      status?: boolean
      assignee?: boolean
      reviewer?: boolean
      qaEngineer?: boolean
    }
  }>(),
  {
    highlightQuery: '',
    display: () => ({
      priority: true,
      status: true,
      assignee: false,
      reviewer: false,
      qaEngineer: false
    })
  }
)

const highlightedKey = computed(() => highlightText(props.issue.key, props.highlightQuery))
const highlightedSummary = computed(() => highlightText(props.issue.summary, props.highlightQuery))

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

const { isRunning, issueKey: activeIssueKey } = storeToRefs(useTimerStore())
const isActiveIssue = computed(() => isRunning.value && activeIssueKey.value === props.issue.key)

const statusColor = computed(() => getStatusColor(props.issue.status))

const hasMeta = computed(
  () =>
    (props.display.assignee && props.issue.assignee) ||
    (props.display.reviewer && props.issue.reviewer) ||
    (props.display.qaEngineer && props.issue.qaEngineer)
)
</script>

<template>
  <div
    class="flex justify-between gap-3 py-2.5 pr-1.5 pl-2 transition-colors"
    :class="{
      'bg-primary/8 ring-primary': isActiveIssue
    }"
  >
    <div class="flex min-w-0 flex-1 flex-col items-start">
      <div class="flex flex-wrap items-center gap-1.5">
        <u-tooltip
          v-if="display.priority !== false"
          :text="chevrons.tooltip"
          :delay-duration="200"
        >
          <span class="inline-flex cursor-help items-center">
            <u-icon
              v-for="n in chevrons.count"
              :key="n"
              :name="chevrons.icon"
              :class="['-mx-0.5 size-3.5', chevrons.color]"
            />
          </span>
        </u-tooltip>

        <u-tooltip
          v-if="isActiveIssue"
          text="Активная задача"
          :delay-duration="200"
        >
          <span class="relative inline-flex size-2 shrink-0 cursor-help">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-success" />
          </span>
        </u-tooltip>

        <u-link
          :to="`https://tracker.yandex.ru/${issue.key}`"
          target="_blank"
          class="font-mono text-xs text-primary hover:underline"
        >
          <span v-html="highlightedKey" />
        </u-link>

        <u-badge
          v-if="display.status !== false"
          :label="issue.status.display"
          :color="statusColor"
          variant="subtle"
          size="sm"
        />
      </div>

      <div
        class="mt-0.5 line-clamp-3 max-w-full truncate text-left text-sm text-wrap"
        v-html="highlightedSummary"
      />

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

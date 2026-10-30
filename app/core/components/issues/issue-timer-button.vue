<script setup lang="ts">
import { useTimerStore } from '~/core/store/use-timer-store'
import { useIssueTransitionModal } from '~/core/composables/use-issue-transition-modal'
import { HEROICONS } from '~/core/constants/heroicons'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const props = defineProps<{ issue: Yandex.Issue }>()

const { isRunning, issueKey: activeIssueKey } = storeToRefs(useTimerStore())
const { startWithConfirm } = useIssueTransitionModal()

const isTrackingThisIssue = computed(() => activeIssueKey.value === props.issue.key && isRunning.value)
const label = computed(() => (isTrackingThisIssue.value ? 'Уже отслеживается' : 'Начать таймер'))

const handleStart = () => startWithConfirm(props.issue)
</script>

<template>
  <u-tooltip
    :text="label"
    :delay-duration="0"
  >
    <u-button
      :icon="HEROICONS.PLAY_CIRCLE"
      variant="ghost"
      size="sm"
      square
      :aria-label="label"
      :disabled="isRunning"
      class="size-fit hover:bg-neutral-500"
      :color="isTrackingThisIssue ? 'success' : 'neutral'"
      @click="handleStart"
    />
  </u-tooltip>
</template>

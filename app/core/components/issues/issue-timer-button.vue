<script setup lang="ts">
import { useTimerStore } from '~/core/store/use-timer-store'
import { useIssueTransitionModal } from '~/core/composables/use-issue-transition-modal'
import { HEROICONS } from '~/core/constants/heroicons'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const props = defineProps<{ issue: Yandex.Issue }>()

const { isRunning, issueKey: activeIssueKey } = storeToRefs(useTimerStore())
const { startWithConfirm } = useIssueTransitionModal()

const handleStart = () => startWithConfirm(props.issue)
</script>

<template>
  <u-tooltip
    :text="activeIssueKey === issue.key && isRunning ? 'Уже отслеживается' : 'Начать таймер'"
    :delay-duration="0"
  >
    <u-button
      :icon="HEROICONS.PLAY_CIRCLE"
      variant="ghost"
      size="sm"
      square
      :disabled="isRunning"
      :color="activeIssueKey === issue.key && isRunning ? 'success' : 'neutral'"
      @click="handleStart"
    />
  </u-tooltip>
</template>

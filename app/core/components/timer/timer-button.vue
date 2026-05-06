<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { useModal } from 'vue-final-modal'
import { useTimerStore } from '~/core/store/use-timer-store'
import { formatHoursToHHMMSS } from '~/core/utils/time'
import { HEROICONS } from '~/core/constants/heroicons'
import { useIssueTransitionModal } from '~/core/composables/use-issue-transition-modal'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const timerStore = useTimerStore()
const { isRunning, issueKey, startedAt } = storeToRefs(timerStore)

const now = useNow({ interval: 1000 })

const displayTime = computed(() => {
  if (!isRunning.value || !startedAt.value) return '00:00:00'
  const elapsed = Math.max(0, Math.floor((now.value.getTime() - new Date(startedAt.value).getTime()) / 1000))
  return formatHoursToHHMMSS(elapsed / 3600)
})

const { startWithConfirm } = useIssueTransitionModal()

const { open: openIssueModal } = useModal({
  component: defineAsyncComponent(() => import('./timer-issue-modal.vue')),
  attrs: {
    onSelect: (issue: Yandex.Issue) => startWithConfirm(issue)
  }
})

const { open: openStopModal, patchOptions: patchStopModal } = useModal({
  component: defineAsyncComponent(() => import('./timer-stop-modal.vue'))
})

const handleStop = () => {
  if (!startedAt.value) return
  const frozen = Math.max(0, Math.floor((now.value.getTime() - new Date(startedAt.value).getTime()) / 1000))
  patchStopModal({ attrs: { frozenSeconds: frozen } })
  openStopModal()
}
</script>

<template>
  <div class="flex items-center gap-1">
    <div class="flex w-full items-center justify-between">
      <template v-if="isRunning">
        <u-badge
          variant="subtle"
          color="neutral"
          size="lg"
          class="flex items-center"
        >
          <span class="size-2 animate-pulse rounded-full bg-error" />
          <span class="font-mono text-sm tabular-nums">{{ displayTime }}</span>
          <span class="max-w-24 truncate text-xs">{{ issueKey }}</span>
        </u-badge>

        <u-tooltip
          text="Остановить таймер"
          :delay-duration="0"
        >
          <u-button
            :icon="HEROICONS.STOP_CIRCLE"
            variant="ghost"
            color="error"
            square
            @click="handleStop"
          />
        </u-tooltip>
      </template>

      <template v-else>
        <p class="animate-pulse text-sm italic">Трекер простаивает</p>
        <u-tooltip
          text="Начать отслеживание"
          :delay-duration="0"
        >
          <u-button
            :icon="HEROICONS.PLAY_CIRCLE"
            variant="ghost"
            square
            @click="openIssueModal()"
          />
        </u-tooltip>
      </template>
    </div>
  </div>
</template>

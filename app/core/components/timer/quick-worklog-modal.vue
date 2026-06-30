<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiDurationInput from '~/core/components/ui/form/ui-duration-input.vue'
import { useTryCatchWithLoading } from '~/core/composables/use-try-catch-with-loading'
import { useWorklogBus } from '~/core/composables/use-worklog-bus'
import { secondsToIsoDuration } from '~/core/utils/time'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const props = defineProps<{ issue: Yandex.Issue }>()
const modelValue = defineModel<boolean>({ default: false })

const totalSeconds = ref(0)
const comment = ref('')

const { runWithLoading: save, isLoading: isSaving } = useTryCatchWithLoading(async () => {
  const worklog = await yandexTrackerApi.worklogCreate(props.issue.key, {
    start: new Date().toISOString(),
    duration: secondsToIsoDuration(totalSeconds.value),
    ...(comment.value.trim() ? { comment: comment.value.trim() } : {})
  })
  if (worklog) {
    useWorklogBus().emit('saved', worklog)
  }
  modelValue.value = false
})

const discard = () => {
  modelValue.value = false
}

watch(modelValue, open => {
  if (open) {
    totalSeconds.value = 0
    comment.value = ''
  }
})
</script>

<template>
  <modal-base v-model="modelValue">
    <ui-card class="w-full">
      <template #header>
        <div class="text-lg font-semibold">Добавить запись</div>
      </template>

      <div class="flex flex-col gap-4">
        <u-badge
          variant="subtle"
          class="flex flex-col items-start rounded-lg px-4 py-3"
          color="neutral"
        >
          <div class="font-mono text-xs text-primary">{{ issue.key }}</div>
          <div class="mt-0.5 text-sm">{{ issue.summary }}</div>
          <ui-duration-input
            v-model="totalSeconds"
            class="mt-3"
          />
        </u-badge>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-neutral-400">
            Комментарий
            <span class="text-neutral-500">(необязательно)</span>
          </label>
          <u-textarea
            v-model="comment"
            :rows="3"
            placeholder="Что делали?"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <u-button
            variant="ghost"
            color="neutral"
            label="Отмена"
            class="w-fit max-sm:ml-auto sm:w-auto"
            @click="discard"
          />
          <u-button
            :loading="isSaving"
            :disabled="totalSeconds === 0"
            color="primary"
            label="Сохранить"
            class="w-fit max-sm:ml-auto sm:w-auto"
            @click="save()"
          />
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>

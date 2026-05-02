<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiDurationInput from '~/core/components/ui/form/ui-duration-input.vue'
import { useTimerStore } from '~/core/store/use-timer-store'

const props = defineProps<{ frozenSeconds: number }>()
const modelValue = defineModel<boolean>({ default: false })

const timerStore = useTimerStore()
const { issueKey, issueSummary, isSaving } = storeToRefs(timerStore)

const comment = ref('')
const totalSeconds = ref(0)

watch(
  () => props.frozenSeconds,
  val => {
    totalSeconds.value = val
  },
  { immediate: true }
)

const confirm = async () => {
  await timerStore.stop(comment.value || undefined, totalSeconds.value)
  modelValue.value = false
}

const discard = () => {
  timerStore.reset()
  modelValue.value = false
}
</script>

<template>
  <modal-base
    v-model="modelValue"
    :prevent-close="false"
  >
    <ui-card class="w-full">
      <template #header>
        <div class="text-lg font-semibold">Остановить таймер</div>
      </template>

      <div class="flex flex-col gap-4">
        <u-badge
          variant="subtle"
          class="flex flex-col items-start rounded-lg px-4 py-3"
          color="neutral"
        >
          <div class="font-mono text-xs text-primary">{{ issueKey }}</div>
          <div class="mt-0.5 text-sm">{{ issueSummary }}</div>
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
            :rows="4"
            placeholder="Что делали?"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <u-button
            variant="ghost"
            color="neutral"
            label="Отменить без сохранения"
            class="w-fit max-sm:ml-auto sm:w-auto"
            @click="discard"
          />
          <u-button
            :loading="isSaving"
            color="error"
            label="Сохранить и остановить"
            class="w-fit max-sm:ml-auto sm:w-auto"
            @click="confirm"
          />
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>

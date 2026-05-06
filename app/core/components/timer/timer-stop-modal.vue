<script setup lang="ts">
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import UiDurationInput from '~/core/components/ui/form/ui-duration-input.vue'
import { useTimerStore } from '~/core/store/use-timer-store'
import yandexTrackerApi from '~/core/api/yandex-tracker.api'
import { useIssueBus } from '~/core/composables/use-issue-bus'
import { HEROICONS } from '~/core/constants/heroicons'
import type { Yandex } from '~/core/types/api/yandex-tracker/yandex-tracker.entity'

const props = defineProps<{ frozenSeconds: number }>()
const modelValue = defineModel<boolean>({ default: false })
const toast = useToast()

const timerStore = useTimerStore()
const { issueKey, issueSummary, isSaving, isRunning } = storeToRefs(timerStore)

const comment = ref('')
const totalSeconds = ref(0)

watch(
  () => props.frozenSeconds,
  val => {
    totalSeconds.value = val
  },
  { immediate: true }
)

const transitions = ref<Yandex.Transition[]>([])
const isLoadingTransitions = ref(false)
const withTransition = ref(false)
const selectedTransitionId = ref<string>()
const isTransitioning = ref(false)

const transitionOptions = computed(() => transitions.value.map(t => ({ label: t.to.display, value: t.id })))

const fetchTransitions = async () => {
  if (!issueKey.value) return
  transitions.value = []
  isLoadingTransitions.value = true
  try {
    transitions.value = (await yandexTrackerApi.issueTransitionsList(issueKey.value)) ?? []
    selectedTransitionId.value = transitions.value[0]?.id ?? undefined
  } catch {
    toast.add({ title: 'Не удалось загрузить доступные переходы', color: 'warning' })
  } finally {
    isLoadingTransitions.value = false
  }
}

onMounted(fetchTransitions)

const confirm = async () => {
  const savedIssueKey = issueKey.value
  await timerStore.stop(comment.value || undefined, totalSeconds.value)
  if (isRunning.value || !savedIssueKey) return

  if (withTransition.value && selectedTransitionId.value) {
    const transition = transitions.value.find(t => t.id === selectedTransitionId.value)
    if (transition) {
      isTransitioning.value = true
      try {
        await yandexTrackerApi.issueTransitionExecute(savedIssueKey, selectedTransitionId.value)
        useIssueBus().emit({ key: savedIssueKey, status: transition.to })
      } catch {
        toast.add({
          title: 'Не удалось сменить статус',
          description: 'Выберите другой статус или смените вручную',
          color: 'error'
        })
      } finally {
        isTransitioning.value = false
      }
    }
  }

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

        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm">Перевести задачу в другой статус</span>
            <u-switch
              v-model="withTransition"
              :disabled="isLoadingTransitions || !transitions.length"
              :checked-icon="HEROICONS.CHECK_20_SOLID"
              :unchecked-icon="HEROICONS.X_MARK_20_SOLID"
            />
          </div>

          <template v-if="withTransition">
            <div
              v-if="isLoadingTransitions"
              class="flex justify-center py-2"
            >
              <u-icon
                :name="HEROICONS.ARROW_PATH"
                class="size-4 animate-spin text-neutral-400"
              />
            </div>
            <u-select
              v-else
              v-model="selectedTransitionId"
              :items="transitionOptions"
              value-key="value"
              label-key="label"
            />
          </template>
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
            :loading="isSaving || isTransitioning"
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

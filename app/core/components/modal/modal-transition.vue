<script setup lang="ts">
import ModalBase from './modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'
import { isoDurationToRu } from '~/core/utils/time'

const props = withDefaults(
  defineProps<{
    description?: string
    existingEstimation?: string
    loading?: boolean
  }>(),
  {
    description: undefined,
    existingEstimation: undefined,
    loading: false
  }
)

const modelValue = defineModel<boolean>({ default: false })
const emit = defineEmits<{ confirm: [originalEstimation?: string]; cancel: [] }>()

const estimation = ref('')

watch(
  () => props.existingEstimation,
  val => {
    estimation.value = val ? isoDurationToRu(val) : ''
  },
  { immediate: true }
)

const confirm = () => {
  emit('confirm', estimation.value.trim() || undefined)
}

const cancel = () => {
  emit('cancel')
  modelValue.value = false
}
</script>

<template>
  <modal-base v-model="modelValue">
    <ui-card class="w-full">
      <template #header>
        <div class="text-lg font-semibold">Перевести задачу в работу?</div>
      </template>

      <div class="flex flex-col gap-3">
        <p
          v-if="description"
          class="text-sm whitespace-pre-line italic"
        >
          {{ description }}
        </p>

        <u-form-field
          label="Временная оценка"
          hint="Необязательно. Формат: 1д2ч30м"
        >
          <u-input
            v-model="estimation"
            placeholder="например: 1д2ч30м"
            class="w-full"
          />
        </u-form-field>
      </div>

      <template #footer>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <u-button
            variant="subtle"
            label="Просто запустить"
            class="w-full sm:w-auto"
            @click="cancel"
          />
          <u-button
            color="primary"
            label="Перевести и запустить"
            :loading="loading"
            class="w-full sm:w-auto"
            @click="confirm"
          />
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>

<script setup lang="ts">
import ModalBase from './modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
  }>(),
  {
    title: 'Подтвердите действие',
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
    loading: false
  }
)

const modelValue = defineModel<boolean>({ default: false })
const emit = defineEmits<{ confirm: []; cancel: [] }>()

const confirm = () => {
  emit('confirm')
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
        <div class="text-lg font-semibold">{{ title }}</div>
      </template>

      <p
        v-if="description"
        class="text-sm whitespace-pre-line italic"
      >
        {{ description }}
      </p>

      <template #footer>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <u-button
            variant="subtle"
            :label="cancelLabel"
            class="w-full sm:w-auto"
            @click="cancel"
          />
          <u-button
            color="error"
            :label="confirmLabel"
            :loading="loading"
            class="w-full sm:w-auto"
            @click="confirm"
          />
        </div>
      </template>
    </ui-card>
  </modal-base>
</template>

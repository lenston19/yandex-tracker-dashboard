<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import type { ModalProps } from '~/core/types/components/modal'
import { twMerge } from 'tailwind-merge'
import { HEROICONS } from '~/core/constants/heroicons'

const props = withDefaults(defineProps<ModalProps>(), {
  ui: () => ({}),
  showClose: true,
  preventClose: undefined
})

const mergedUI = computed(() => {
  return {
    body: twMerge('flex items-center justify-center', props.ui?.body),
    content: twMerge('relative w-full max-w-[27.5rem] rounded-xl bg-neutral-800 drop-shadow-lg', props.ui?.content),
    close: twMerge('absolute top-2 right-2 rounded-none p-4', props.ui?.close)
  }
})

const emit = defineEmits(['close'])

const modelValue = defineModel<boolean>({ default: false })

function closeWindow() {
  modelValue.value = false
  emit('close')
}
</script>

<template>
  <vue-final-modal
    v-model="modelValue"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
    :class="mergedUI.body"
    :content-class="mergedUI.content"
    :click-to-close="preventClose"
  >
    <u-button
      v-if="showClose"
      variant="link"
      :icon="HEROICONS.X_MARK"
      :class="mergedUI.close"
      class="absolute top-0 right-0 z-2 text-white"
      square
      @click="closeWindow"
    />
    <slot :close="closeWindow" />
  </vue-final-modal>
</template>

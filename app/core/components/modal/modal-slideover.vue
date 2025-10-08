<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { twMerge } from 'tailwind-merge'
import type { ModalSlideoverProps } from '../../types/components/modal'

const props = withDefaults(defineProps<ModalSlideoverProps>(), {
  ui: () => ({})
})

const modelValue = defineModel<boolean>({ default: false })

const mergedUI = computed(() => {
  return {
    overlay: twMerge('fixed inset-0 bg-neutral-950/75 backdrop-blur-[0.25rem] transition-opacity duration-300'),
    header: twMerge('border-b border-gray-200 p-3 sm:px-8 sm:py-7'),
    body: twMerge('px-6 py-4.5', props.ui?.body),
    content: twMerge(
      'fixed top-0 bottom-0 left-0 flex h-svh w-full transform flex-col bg-default text-default transition-transform duration-300 md:w-60 dark:bg-neutral-900',
      props.ui?.content
    )
  }
})

const emit = defineEmits(['close'])

function closeWindow() {
  modelValue.value = false
  emit('close')
}
</script>

<template>
  <vue-final-modal
    v-model="modelValue"
    :overlay-class="mergedUI.overlay"
    overlay-transition="vfm-fade"
    content-transition="vfm-slide-left"
  >
    <div
      class="flex-col overflow-y-auto bg-gray-50"
      :class="mergedUI.content"
    >
      <div
        v-if="$slots.header"
        :class="mergedUI.header"
      >
        <slot
          name="header"
          :close="closeWindow"
        />
      </div>

      <div
        class="grow overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
        :class="mergedUI.body"
      >
        <slot :close="closeWindow" />
      </div>
    </div>
  </vue-final-modal>
</template>

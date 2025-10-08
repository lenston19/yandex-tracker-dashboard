<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { twMerge } from 'tailwind-merge'
import type { ModalDrawerProps } from '../../types/components/modal'

const props = withDefaults(defineProps<ModalDrawerProps>(), {
  ui: () => ({}),
  showCloseIcon: true
})

const modelValue = defineModel<boolean>({ default: false })

const mergedUI = computed(() => {
  return {
    header: twMerge(
      'relative h-[36px] px-4 pt-4 before:absolute before:top-3 before:left-1/2 before:h-[5px] before:w-10 before:-translate-x-1/2 before:rounded-full before:bg-neutral-700',
      props.ui?.header
    ),
    content: twMerge(
      'absolute bottom-0 flex max-h-[calc(100svh-40px)] w-full flex-col overflow-y-auto rounded-t-3xl bg-neutral-800',
      props.ui?.content
    ),
    body: twMerge('h-fit grow overflow-y-auto scroll-smooth px-6 pt-3 pb-6', props.ui?.body)
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
    swipe-to-close="down"
    content-transition="vfm-slide-down"
    overlay-transition="vfm-fade"
    :content-class="mergedUI.content"
    @closed="emit('close')"
  >
    <div :class="mergedUI.header">
      <slot
        v-if="$slots.header"
        name="header"
        :close="closeWindow"
      />
    </div>

    <div :class="mergedUI.body">
      <slot :close="closeWindow" />
    </div>
  </vue-final-modal>
</template>

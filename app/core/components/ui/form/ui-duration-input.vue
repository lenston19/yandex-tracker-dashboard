<script setup lang="ts">
import TimeUnitInput from './time-unit-input.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    min?: number
    max?: number
  }>(),
  {
    min: 0,
    max: undefined
  }
)

const modelValue = defineModel<number>({ default: 0 })

const clamp = (v: number) => {
  const result = Math.max(props.min, v)
  return props.max !== undefined ? Math.min(props.max, result) : result
}

const hours = computed({
  get: () => Math.floor(modelValue.value / 3600),
  set: v => {
    modelValue.value = clamp(v * 3600 + minutes.value * 60 + seconds.value)
  }
})

const minutes = computed({
  get: () => Math.floor((modelValue.value % 3600) / 60),
  set: v => {
    modelValue.value = clamp(hours.value * 3600 + v * 60 + seconds.value)
  }
})

const seconds = computed({
  get: () => modelValue.value % 60,
  set: v => {
    modelValue.value = clamp(hours.value * 3600 + minutes.value * 60 + v)
  }
})
</script>

<template>
  <div class="flex w-full items-center gap-1 overflow-hidden">
    <time-unit-input
      v-model="hours"
      label="ч"
      :min="0"
    />
    <span class="mb-6 text-xl font-bold text-neutral-300">:</span>
    <time-unit-input
      v-model="minutes"
      label="м"
      :min="0"
      :max="59"
    />
    <span class="mb-6 text-xl font-bold text-neutral-300">:</span>
    <time-unit-input
      v-model="seconds"
      label="с"
      :min="0"
      :max="59"
    />
  </div>
</template>

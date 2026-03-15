<script setup lang="ts">
import { HOURS_PLURALIZE } from '~/core/constants/pluralize-array-words'
import { pluralize } from '~/core/utils/pluralize'

const props = withDefaults(
  defineProps<{
    hours?: number | null
    min?: number
    max?: number
    showMax?: boolean
    isHoliday?: boolean
  }>(),
  {
    hours: null,
    min: 0,
    max: 8,
    showMax: false,
    isHoliday: false
  }
)

const computedMax = computed(() => {
  if (props.isHoliday) return props.hours || 1
  return props.max === 0 ? 8 : props.max
})

const computedColor = computed(() => {
  if (props.isHoliday) return props.hours ? 'info' : 'neutral'
  if (props.hours) {
    if (props.hours < 2) return 'error'
    else if (props.hours < props.max) return 'warning'
  }
  return 'success'
})

const hoursPlural = computed(() => (props.hours !== null ? pluralize(props.hours, HOURS_PLURALIZE) : ''))
const maxPlural = computed(() => props.max > 0 && `/ ${pluralize(props.max, HOURS_PLURALIZE)}`)

const percent = computed(() => {
  if (!props.hours) return 0
  return Math.round((props.hours / props.max) * 100)
})

const modelValue = computed(() => {
  if (props.isHoliday && !props.hours) {
    return 0
  }

  if (props.hours !== null) {
    return Math.min(props.hours, computedMax.value)
  }

  return 0
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <u-progress
      :model-value="modelValue"
      :min="min"
      :max="computedMax"
      :color="computedColor"
      animation="swing"
    />
    <div class="flex w-full justify-between gap-2">
      <slot name="help-text" />
      <template v-if="hours !== null && hours >= 0">
        <div
          v-if="isHoliday && !hours"
          class="ml-auto text-right text-sm text-muted"
        >
          Выходной
        </div>
        <u-tooltip
          v-else
          :delay-duration="0"
          :text="`Максимально ${pluralize(computedMax, HOURS_PLURALIZE)}`"
        >
          <div class="ml-auto flex gap-1 text-right text-sm">
            <span class="underline"> {{ hoursPlural }} {{ props.showMax ? maxPlural : '' }}</span>
            <span class="font-light italic">
              ({{ Number.isNaN(percent) || !percent ? 0 : Math.floor(percent) }}%)
            </span>
          </div>
        </u-tooltip>
      </template>
      <u-skeleton
        v-else
        class="ml-auto h-[20px] w-[100px]"
      />
    </div>
  </div>
</template>

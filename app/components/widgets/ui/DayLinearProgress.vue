<script setup lang="ts">
import { hoursPluralize } from '~/constants/pluralize-array-words'
import { pluralize } from '~/helpers/utils/pluralize'

const props = withDefaults(
  defineProps<{
    hours?: number | null
    min?: number
    max?: number
    showMax?: boolean
  }>(),
  {
    hours: null,
    min: 0,
    max: 8,
    showMax: false
  }
)

const computedMax = computed(() => (props.max === 0 ? 8 : props.max))

const computedColor = computed(() => {
  if (props.hours) {
    if (props.hours < 2) {
      return 'error'
    } else if (props.hours < props.max) {
      return 'warning'
    }
  }

  return 'success'
})

const hoursPlural = computed(() => (props.hours !== null ? pluralize(props.hours, hoursPluralize) : ''))
const maxPlural = computed(() => props.max > 0 && `/ ${pluralize(props.max, hoursPluralize)}`)

const percent = computed(() => {
  if (!props.hours) {
    return 0
  }

  return Math.round((props.hours / props.max) * 100)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <u-progress
      :model-value="hours ?? undefined"
      :min="min"
      :max="computedMax"
      :color="computedColor"
      animation="swing"
    />
    <u-tooltip
      v-if="hours !== null && hours >= 0"
      :delay-duration="0"
      :text="`Максимально ${pluralize(computedMax, hoursPluralize)}`"
    >
      <div class="ml-auto flex gap-1 text-right text-sm">
        <span class="underline"> {{ hoursPlural }} {{ props.showMax ? maxPlural : '' }}</span>
        <span class="font-light italic"> ({{ Number.isNaN(percent) || !percent ? 0 : Math.floor(percent) }}%) </span>
      </div>
    </u-tooltip>
    <u-skeleton
      v-else
      class="ml-auto h-[20px] w-[100px]"
    />
  </div>
</template>

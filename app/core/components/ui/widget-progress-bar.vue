<script setup lang="ts">
import type { UiColors } from '~/core/types'

const props = withDefaults(
  defineProps<{
    value: number | null
    max: number
    loading?: boolean
    color?: UiColors
  }>(),
  {
    loading: false,
    color: 'primary'
  }
)
</script>

<template>
  <u-skeleton
    v-if="props.loading"
    class="h-1 w-full"
  />
  <u-progress
    v-else
    :model-value="props.value ?? 0"
    :max="props.max"
    :color="props.color"
    size="sm"
  />
</template>

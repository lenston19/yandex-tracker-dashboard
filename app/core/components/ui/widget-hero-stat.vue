<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: number | null
    max?: number | null
    unit?: string
    loading?: boolean
  }>(),
  {
    max: null,
    unit: 'ч',
    loading: false
  }
)
</script>

<template>
  <u-skeleton
    v-if="props.loading"
    class="h-9 w-32"
  />
  <div
    v-else
    class="flex items-baseline gap-1.5"
  >
    <span class="text-2xl font-bold text-highlighted">{{ props.value ?? 0 }}</span>
    <span class="text-lg font-medium text-muted">{{ props.unit }}</span>
    <span
      v-if="props.max"
      class="text-sm text-muted"
    >
      / {{ props.max }} {{ props.unit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { HEROICONS } from '~/core/constants/heroicons'

const { title = 'Нет данных' } = defineProps<{ title?: string }>()
</script>

<template>
  <div class="flex min-h-32 flex-col items-center justify-center gap-4">
    <u-icon
      :name="HEROICONS.CIRCLE_STACK_20_SOLID"
      class="size-6"
    />
    <div class="text-sm font-medium text-muted">{{ title }}</div>
  </div>
</template>

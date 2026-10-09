<script setup lang="ts">
import { HEROICONS } from '~/core/constants/heroicons'

withDefaults(
  defineProps<{
    text: string
    icon?: string
  }>(),
  { icon: HEROICONS.INFORMATION_CIRCLE }
)
</script>

<template>
  <u-popover :ui="{ content: 'h-auto items-start' }">
    <u-icon
      :name="icon"
      class="size-3.5 shrink-0 cursor-help text-muted"
    />
    <template #content>
      <span
        class="block max-w-64 p-2 text-xs"
        v-html="text"
      />
    </template>
  </u-popover>
</template>

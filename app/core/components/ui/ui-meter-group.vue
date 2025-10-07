<script setup lang="ts">
import { computed } from 'vue'

import {} from 'module'

const props = defineProps<{
  min?: number
  max?: number
  items: {
    value: number
    color: string
    label: string
  }[]
  size?: 'sm' | 'md' | 'lg'
}>()

const min = props.min ?? 0
const max = props.max ?? 100
const total = max - min

const heightClass = computed(() => {
  switch (props.size) {
    case 'md':
      return 'h-4'
    case 'lg':
      return 'h-6'
    default:
      return 'h-2'
  }
})
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div
      class="relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700"
      :class="heightClass"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="absolute top-0 bottom-0"
        :style="{
          left: `${items.slice(0, index).reduce((acc, i) => acc + ((i.value - min) / total) * 100, 0)}%`,
          width: `${((item.value - min) / total) * 100}%`,
          backgroundColor: item.color
        }"
      />
    </div>

    <ul class="flex flex-col gap-1 text-sm">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-2"
      >
        <span
          class="h-3 w-3 rounded-full"
          :style="{ backgroundColor: item.color }"
        />
        <span :style="{ color: item.color }">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

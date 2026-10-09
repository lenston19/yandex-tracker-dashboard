<script setup lang="ts">
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
      return 'h-3'
    case 'lg':
      return 'h-5'
    default:
      return 'h-1'
  }
})
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <div
      class="relative w-full overflow-hidden rounded-full bg-accented"
      :class="heightClass"
    >
      <div
        v-for="(item, index) in items"
        :key="index"
        class="absolute inset-y-0"
        :style="{
          left: `${items.slice(0, index).reduce((acc, i) => acc + ((i.value - min) / total) * 100, 0)}%`,
          width: `${((item.value - min) / total) * 100}%`,
          backgroundColor: item.color
        }"
      />
    </div>

    <ul class="flex flex-col gap-1 text-xs text-muted">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-1.5"
      >
        <span
          class="size-2.5 shrink-0 rounded-full"
          :style="{ backgroundColor: item.color }"
        />
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

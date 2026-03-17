<script setup lang="ts">
defineProps<{
  colorRanges: { label: string; color: string }[]
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
    <div class="flex items-center gap-1 max-md:hidden">
      <span>меньше</span>
      <u-tooltip
        v-for="range in colorRanges"
        :key="range.label"
        :delay-duration="0"
        :text="range.label"
      >
        <div
          class="size-3 cursor-help rounded-[3px]"
          :style="{ backgroundColor: range.color }"
        />
      </u-tooltip>
      <span>больше</span>
    </div>
    <div class="grid grid-cols-2 gap-x-3 gap-y-1 md:hidden">
      <span
        v-for="range in colorRanges"
        :key="range.label"
        class="flex items-center gap-1"
      >
        <div
          class="size-3 rounded-[2px]"
          :style="{ backgroundColor: range.color }"
        />
        {{ range.label }}
      </span>
    </div>
  </div>
</template>

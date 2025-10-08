<script setup lang="ts">
withDefaults(
  defineProps<{
    pageCount?: number
    total: number
  }>(),
  {
    pageCount: 5
  }
)

const page = defineModel<number>({ default: 1 })
</script>

<template>
  <div class="flex justify-end">
    <u-pagination
      v-model:page="page"
      :items-per-page="pageCount"
      :total="total"
      color="neutral"
      variant="subtle"
    />
  </div>
</template>

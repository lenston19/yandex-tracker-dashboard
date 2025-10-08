<script setup lang="ts">
import WorklogActions from '../worklogs/worklog-actions.vue'
import type { WorklogActionsProps } from '../../types/worklogs'

defineProps<
  {
    title: string
  } & WorklogActionsProps
>()
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="text-2xl font-semibold capitalize">
      {{ title }}
    </div>
    <worklog-actions
      :loading="loading"
      :next="next"
      :prev="prev"
      :refresh="refresh"
      type="month"
    />
  </div>
</template>

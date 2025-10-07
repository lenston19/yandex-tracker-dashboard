<script setup lang="ts">
import { HEROICONS } from '~/constants/heroicons'
</script>

<template>
  <div class="flex min-h-32 flex-col items-center justify-center gap-4">
    <u-icon
      :name="HEROICONS.CIRCLE_STACK_20_SOLID"
      class="h-6 w-6"
    />
    <div class="text-h4">Нет данных</div>
  </div>
</template>

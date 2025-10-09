<script setup lang="ts">
import MonthlyReportView from '~/modules/monthly-report/views/monthly-report-view.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <monthly-report-view />
</template>

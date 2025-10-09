<script setup lang="ts">
import DashboardView from '~/modules/dashboard/views/dashboard-view.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <dashboard-view />
</template>

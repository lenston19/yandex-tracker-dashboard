<script setup lang="ts">
import MyIssuesQueueView from '~/modules/my-issues/views/my-issues-queue-view.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <my-issues-queue-view />
</template>

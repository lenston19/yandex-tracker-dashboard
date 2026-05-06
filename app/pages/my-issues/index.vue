<script setup lang="ts">
import MyIssuesView from '~/modules/my-issues/views/my-issues-view.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <my-issues-view />
</template>

<script setup lang="ts">
import ProjectsView from '~/modules/projects/views/projects-view.vue'

definePageMeta({
  middleware: ['auth']
})
</script>

<template>
  <projects-view />
</template>

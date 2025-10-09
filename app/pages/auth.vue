<script setup lang="ts">
import AuthView from '~/modules/auth/views/auth-view.vue'

definePageMeta({
  layout: 'empty',
  middleware: ['empty-organization-id']
})
</script>

<template>
  <auth-view />
</template>

<script setup lang="ts">
import { SITEMAP } from '~/core/utils/router/sitemap/index'
import { useAuthStore } from '~/core/store/use-auth-store'
import { UNAUTH_SECTIONS, AUTH_SECTIONS } from '../models/constants/sections'

useHead({ title: SITEMAP.settings.name })

const { mySelf } = storeToRefs(useAuthStore())

const sections = computed(() => {
  if (!mySelf.value) return UNAUTH_SECTIONS
  return AUTH_SECTIONS
})
</script>

<template>
  <div class="flex gap-6 lg:gap-10">
    <aside class="hidden w-44 shrink-0 lg:block">
      <u-navigation-menu
        :items="sections.map(s => ({ label: s.label, href: `#${s.id}`, icon: s.icon }))"
        orientation="vertical"
        class="sticky top-4"
      />
    </aside>

    <div class="min-w-0 flex-1 space-y-6">
      <component
        :is="section.component"
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
      />
    </div>
  </div>
</template>

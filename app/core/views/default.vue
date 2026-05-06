<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import { useSiteSettingsStore } from '~/modules/settings'
import { useAuthStore } from '~/core/store/use-auth-store'
import UiLoadingOverlay from '~/core/components/ui/ui-loading-overlay.vue'
import AppSidebarContent from '~/core/components/app/app-sidebar-content.vue'
import AppLogo from '~/core/components/app/app-logo.vue'
import { HEROICONS } from '~/core/constants/heroicons'

const { seasonalTheme } = storeToRefs(useSiteSettingsStore())
const { isLoading: isLoadingMySelf } = storeToRefs(useAuthStore())

const seasonalThemeComponent = computed(() => {
  switch (seasonalTheme.value.type) {
    case 'halloween':
      return defineAsyncComponent(() => import('../components/theme/theme-halloween.vue'))
    case 'new-year':
      return defineAsyncComponent(() => import('../components/theme/theme-new-year.vue'))
    default:
      return null
  }
})

const { open: openSidebar, close: closeSidebar } = useModal({
  component: defineAsyncComponent(() => import('~/core/components/app/app-mobile-sidebar.vue'))
})

const route = useRoute()
watch(route, () => closeSidebar())
</script>

<template>
  <ui-loading-overlay v-model="isLoadingMySelf" />
  <component
    :is="seasonalThemeComponent"
    v-if="seasonalTheme.active && !isLoadingMySelf"
  />

  <div
    v-if="!isLoadingMySelf"
    class="flex h-svh"
  >
    <aside class="hidden w-60 shrink-0 flex-col border-r border-default lg:flex lg:h-svh">
      <div class="flex h-14 items-center px-4">
        <app-logo />
      </div>
      <div class="min-h-0 flex-1">
        <app-sidebar-content />
      </div>
    </aside>

    <main class="flex h-svh flex-1 flex-col overflow-auto">
      <div
        class="sticky top-0 z-10 flex items-center justify-between border-b border-default px-4 py-3 backdrop-blur-sm lg:hidden"
      >
        <app-logo />
        <u-button
          :icon="HEROICONS.BARS_3"
          size="sm"
          square
          @click="openSidebar()"
        />
      </div>

      <u-container class="py-5 lg:py-10">
        <nuxt-page />
      </u-container>
    </main>
  </div>
</template>

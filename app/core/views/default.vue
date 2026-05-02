<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings'
import { useAuthStore } from '~/core/store/use-auth-store'
import UiLoadingOverlay from '~/core/components/ui/ui-loading-overlay.vue'
import AppUser from '~/core/components/app/app-user.vue'
import TimerButton from '~/core/components/timer/timer-button.vue'
import { SITEMAP } from '~/core/utils/router/sitemap'
import { APP_PAGES, UNAUTH_APP_PAGES } from '~/core/constants/menu'

const { seasonalTheme } = storeToRefs(useSiteSettingsStore())
const { isLoading: isLoadingMySelf, userName } = storeToRefs(useAuthStore())
const { login } = storeToRefs(useAuthStore())
const { organizationId } = storeToRefs(useSiteSettingsStore())

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

const pages = computed(() => (organizationId.value && login.value ? APP_PAGES : UNAUTH_APP_PAGES))
</script>

<template>
  <ui-loading-overlay v-model="isLoadingMySelf" />
  <component
    :is="seasonalThemeComponent"
    v-if="seasonalTheme.active && !isLoadingMySelf"
  />

  <u-dashboard-group
    v-if="!isLoadingMySelf"
    storage="local"
  >
    <u-dashboard-sidebar
      :ui="{
        footer: 'border-t border-default flex flex-col'
      }"
    >
      <template #header>
        <nuxt-link
          :to="SITEMAP.main.route"
          class="flex items-center gap-2 truncate text-sm font-semibold text-highlighted"
        >
          YTDashboard
        </nuxt-link>
      </template>

      <u-navigation-menu
        :items="pages"
        orientation="vertical"
        class="w-full"
      />

      <template
        v-if="userName"
        #footer
      >
        <timer-button class="w-full" />

        <div class="w-full rounded-md bg-primary/20 px-2 py-1">
          <app-user />
        </div>

        <u-color-mode-select
          class="w-full"
          :ui="{ content: 'z-9999' }"
        />
      </template>
    </u-dashboard-sidebar>

    <main class="flex min-h-svh flex-1 flex-col overflow-auto">
      <u-container class="py-5 lg:py-10">
        <nuxt-page />
      </u-container>
    </main>
  </u-dashboard-group>
</template>

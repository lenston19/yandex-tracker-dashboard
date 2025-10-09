<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useAuthStore } from '~/core/store/use-auth-store'
import UiLoadingOverlay from '~/core/components/ui/ui-loading-overlay.vue'
import { useScrollLock, useToggle } from '@vueuse/core'
import AppMenu from '~/core/components/app/app-menu.vue'
import AppUser from '~/core/components/app/app-user.vue'

const { seasonalTheme } = storeToRefs(useSiteSettingsStore())
const { isLoading: isLoadingMySelf, userName } = storeToRefs(useAuthStore())

const bodyContainer = ref<HTMLElement | null>(null)

const isLockedBodyScroll = useScrollLock(bodyContainer)
const toggleLockBodyScroll = useToggle(isLockedBodyScroll)

watchEffect(() => {
  toggleLockBodyScroll(isLoadingMySelf.value)
})

onMounted(() => {
  nextTick(() => {
    bodyContainer.value = document.body
  })
})

const seasonalThemeComponent = computed(() => {
  switch (seasonalTheme.value.type) {
    case 'halloween':
      return defineAsyncComponent(() => import('../components/theme/theme-halloween.vue'))

    default:
      return null
  }
})
</script>

<template>
  <ui-loading-overlay v-model="isLoadingMySelf" />
  <component
    :is="seasonalThemeComponent"
    v-if="seasonalTheme.active && !isLoadingMySelf"
  />
  <template v-if="!isLoadingMySelf">
    <header
      class="flex min-h-[61px] items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800"
    >
      <app-menu />
      <div
        v-if="userName"
        class="ml-auto flex items-center gap-1 lg:gap-4"
      >
        <app-user />
      </div>
    </header>
    <main>
      <u-container class="my-4">
        <nuxt-page />
      </u-container>
    </main>
  </template>
</template>

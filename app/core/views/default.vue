<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { useAuthStore } from '~/core/store/use-auth-store'
import UiLoadingOverlay from '~/core/components/ui/ui-loading-overlay.vue'
import { useScrollLock, useToggle } from '@vueuse/core'
import AppMenu from '~/core/components/app/app-menu.vue'
import AppUser from '~/core/components/app/app-user.vue'

const { organizationId } = storeToRefs(useSiteSettingsStore())
const { login, isLoading: isLoadingMySelf, userName } = storeToRefs(useAuthStore())

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
</script>

<template>
  <ui-loading-overlay v-model="isLoadingMySelf" />
  <template v-if="!isLoadingMySelf">
    <header
      class="flex min-h-[61px] items-center justify-between border-b border-gray-200 px-4 py-2 dark:border-gray-800"
    >
      <app-menu v-if="organizationId && login" />
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

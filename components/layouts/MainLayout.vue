<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/site-settings'
import { useAuthStore } from '~/stores/auth'
import UiLoadingOverlay from '~/components/ui/UiLoadingOverlay.vue'
import { useScrollLock, useToggle } from '@vueuse/core'
import AppMenu from '~/components/app/AppMenu.vue'
import AppUser from '~/components/app/AppUser.vue'
import AppThemeToggle from '~/components/app/AppThemeToggle.vue'
import AppLogin from '~/components/app/AppLogin.vue'

const { organizationId, accessToken } = storeToRefs(useSiteSettingsStore())
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
	<UiLoadingOverlay v-model="isLoadingMySelf" />
	<header
		class="border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 py-2 min-h-[61px]"
	>
		<AppMenu v-if="organizationId && login" />
		<div class="flex items-center gap-4 ml-auto">
			<AppThemeToggle />
			<AppUser v-if="userName" />
			<AppLogin v-if="!accessToken && !!organizationId" />
		</div>
	</header>
	<main>
		<slot></slot>
	</main>
</template>

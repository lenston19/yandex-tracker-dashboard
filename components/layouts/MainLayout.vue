<script setup lang="ts">
import { pages } from "~/helpers/static/menu"
import SettingsOrganizationIdModal from "~/components/settings/modals/SettingsOrganizationIdModal.vue"
import { useSiteSettingsStore } from "~/stores/site-settings"
import { useAuthStore } from "~/stores/auth"
import { HEROICONS } from "~/helpers/static/heroicons"
import UiLoadingOverlay from "~/components/ui/UiLoadingOverlay.vue"
import { useScrollLock } from '@vueuse/core'

const config = useRuntimeConfig()
const colorMode = useColorMode()

const { isNeedOrganizationId, organizationId, accessToken } = storeToRefs(
	useSiteSettingsStore()
)
const { userName, userAvatarUrl, login, isLoading: isLoadingMySelf } = storeToRefs(useAuthStore())

const bodyContainer = ref<HTMLElement | null>(null)

const isLockedBodyScroll = useScrollLock(bodyContainer)

const isOpenSlideover = ref<boolean>(false)

const isDark = computed({
	get: () => colorMode.value === "dark",
	set: (_) =>
		(colorMode.preference = colorMode.value === "dark" ? "light" : "dark"),
})

const getUserAccessToken = () => {
	window.open(
		`https://oauth.yandex.ru/authorize?response_type=token&client_id=${config.public.yandexClientId}`,
		"_blank"
	)
}

watchEffect(() => {
	isLockedBodyScroll.value = isLoadingMySelf.value
})

onMounted(() => {
	nextTick(() => {
		bodyContainer.value = document.querySelector('body')
	})
})
</script>

<template>
	<UiLoadingOverlay v-model="isLoadingMySelf" />
	<header
		class="border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 py-2 min-h-[61px]">
		<template v-if="organizationId && login">
			<UButton
				class="flex"
				:icon="HEROICONS.BARS_3"
				@click="isOpenSlideover = !isOpenSlideover"
			/>
			<USlideover
				v-if="organizationId && login"
				v-model="isOpenSlideover"
				side="left"
				:ui="{
					height: 'max-h-fit',
				}"
			>
				<div class="p-4">
					<UVerticalNavigation
						:links="pages"
						@click="isOpenSlideover = !isOpenSlideover"
					/>
				</div>
			</USlideover>
		</template>
		<div class="flex items-center gap-4 ml-auto">
			<ClientOnly>
				<UButton
					:icon="isDark ? HEROICONS.MOON_20_SOLID : HEROICONS.SUN_20_SOLID
						"
					color="gray"
					variant="ghost"
					@click="isDark = !isDark"
				/>
			</ClientOnly>
			<UButton
				v-if="userName"
				color="gray"
				:to="{ name: 'settings' }"
				class="h-fit"
			>
				<UAvatar
					:src="userAvatarUrl"
					:alt="userName"
				/>
				{{ userName }}
			</UButton>
			<UButton
				v-if="!accessToken && !!organizationId"
				color="red"
				@click="getUserAccessToken"
				label="Войти через Яндекс"
				class="h-fit"
			/>
		</div>
	</header>
	<main>
		<slot></slot>
	</main>
	<SettingsOrganizationIdModal v-model="isNeedOrganizationId" />
</template>

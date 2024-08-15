<script setup lang="ts">
import { pages } from "~/helpers/static/menu"
import SettingsOrganizationIdModal from "~/components/settings/modals/SettingsOrganizationIdModal.vue"
import { useSiteSettingsStore } from "~/store/site-settings"
import { useAuthStore } from "~/store/auth"
import { storeToRefs } from "pinia"

const config = useRuntimeConfig()
const colorMode = useColorMode()

const { isNeedOrganizationId, organizationId, accessToken } = storeToRefs(
	useSiteSettingsStore()
)
const { userName, userAvatarUrl, login } = storeToRefs(useAuthStore())

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
</script>

<template>
	<div class="main-layout">
		<div
			class="border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 py-2"
		>
			<template v-if="organizationId && login">
				<UButton
					class="flex"
					icon="i-heroicons-bars-3"
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
						:icon="
							isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
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
					<UAvatar :src="userAvatarUrl" :alt="userName" />
					{{ userName }}
				</UButton>
				<UButton
					v-if="!accessToken && !!organizationId"
					color="red"
					@click="getUserAccessToken"
					label="Яндекс"
					class="h-fit"
				/>
			</div>
		</div>
		<slot></slot>
		<SettingsOrganizationIdModal v-model="isNeedOrganizationId" />
	</div>
</template>

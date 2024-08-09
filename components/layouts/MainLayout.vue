<script setup lang="ts">
import { pages } from '~/helpers/static/menu';
import SettingsOrganizationIdModal from '~/components/settings/modals/SettingsOrganizationIdModal.vue'
import { useSiteSettingsStore } from '~/store/site-settings';
import { useAuthStore } from '~/store/auth';
import { storeToRefs } from 'pinia';

const config = useRuntimeConfig()

const { isNeedOrganizationId, organizationId } = storeToRefs(useSiteSettingsStore())
const { accessToken, userName } = storeToRefs(useAuthStore())

const getUserAccessToken = () => {
	window.open(`https://oauth.yandex.ru/authorize?response_type=token&client_id=${config.public.yandexClientId}`, '_blank')
}
</script>

<template>
	<div class="main-layout">
		<div class="border-b border-gray-200 dark:border-gray-800 flex items-center px-4 py-2">
			<UHorizontalNavigation :links="pages" />
			<UButton
				v-if="userName"
				icon="i-heroicons-user"
				color="gray"
				:label="userName"
				:to="{ name: 'settings' }"
				class="h-fit"
			/>
			<UButton
				v-if="!accessToken && !!organizationId"
				color="red"
				@click="getUserAccessToken"
				label="Яндекс"
				class="h-fit"
			/>
		</div>

		<slot></slot>
		<SettingsOrganizationIdModal v-model="isNeedOrganizationId" />
	</div>
</template>

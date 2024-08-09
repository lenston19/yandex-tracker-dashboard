<script setup lang="ts">
import SettingsOrganizationIdModal from '~/components/settings/modals/SettingsOrganizationIdModal.vue'
import { useSiteSettingsStore } from '~/store/site-settings';

const siteSettingsStore = useSiteSettingsStore()
const dialog = ref<boolean>(false)
</script>

<template>
	<SettingsOrganizationIdModal
		v-model="dialog"
	/>

	<UCard>
		<template #header>
			<div class="text-xl">
				ID Организации
			</div>
		</template>

		<div class="text-accent overflow-hidden truncate">
			{{ siteSettingsStore.organizationId || 'Пусто' }}
		</div>

		<template #footer>
			<UButton @click="dialog = true" :label="siteSettingsStore.organizationId ? 'Изменить' : 'Добавить'">
			</UButton>
		</template>
	</UCard>
</template>

<style scoped lang="scss">

</style>

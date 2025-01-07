<script setup lang="ts">
import SettingsOrganizationIdModal from "~/components/settings/modals/SettingsOrganizationIdModal.vue"
import { useSiteSettingsStore } from "~/stores/site-settings"
import UiCard from '~/components/ui/UiCard.vue'

const siteSettingsStore = useSiteSettingsStore()
const dialog = ref<boolean>(false)
</script>

<template>
	<SettingsOrganizationIdModal v-model="dialog" />

	<UiCard title="ID Организации">
		<div class="text-accent overflow-hidden truncate">
			{{ siteSettingsStore.organizationId || "Пусто" }}
		</div>

		<template #footer>
			<UButton
				@click="dialog = true"
				:label="siteSettingsStore.organizationId ? 'Изменить' : 'Добавить'"
			/>
		</template>
	</UiCard>
</template>

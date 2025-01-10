<script setup lang="ts">
import UiCard from '~/components/ui/UiCard.vue'
import SettingsTimeZoneModal from '~/components/settings/modals/SettingsTimeZoneModal.vue'

const { timeZone } = storeToRefs(useSiteSettingsStore())

const modal = useModal()

function openModal() {
	modal.open(SettingsTimeZoneModal)
}
</script>

<template>
	<UiCard title="Временная зона">
		<div class="text-accent overflow-hidden truncate">
			{{ timeZone.id }}
		</div>
		<template #footer>
			<UButton
				@click="openModal"
				label="Изменить"
			/>
		</template>
	</UiCard>
</template>

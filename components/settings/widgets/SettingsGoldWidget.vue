<script setup lang="ts">
import SettingsGoldModal from '~/components/settings/modals/SettingsGoldModal.vue'
import { formatRUB } from '~/helpers/utils/format-money'
import { useSiteSettingsStore } from '~/stores/site-settings'
import UiCard from '~/components/ui/UiCard.vue'

const { gold } = storeToRefs(useSiteSettingsStore())
const modal = useModal()

function openModal() {
	modal.open(SettingsGoldModal)
}
</script>

<template>
	<UiCard title="Ставка">
		<div class="text-accent overflow-hidden truncate">
			{{ formatRUB(gold) || 'Пусто' }}
		</div>

		<template #footer>
			<UButton
				label="Изменить"
				@click="openModal"
			/>
		</template>
	</UiCard>
</template>

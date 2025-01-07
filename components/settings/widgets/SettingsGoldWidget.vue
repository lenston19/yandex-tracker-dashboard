<script setup lang="ts">
import SettingsGoldModal from "~/components/settings/modals/SettingsGoldModal.vue"
import { formatRUB } from "~/helpers/utils/format-money"
import { useSiteSettingsStore } from "~/stores/site-settings"
import UiCard from '~/components/ui/UiCard.vue'

const { gold } = storeToRefs(useSiteSettingsStore())

const dialog = ref<boolean>(false)
</script>

<template>
	<SettingsGoldModal v-model="dialog" />

	<UiCard title="Ставка">
		<div class="text-accent overflow-hidden truncate">
			{{ formatRUB(gold) || "Пусто" }}
		</div>

		<template #footer>
			<UButton
				@click="dialog = true"
				label="Изменить"
			/>
		</template>
	</UiCard>
</template>

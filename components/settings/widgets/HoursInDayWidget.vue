<script setup lang="ts">
import SettingsHoursInDayModal from "~/components/settings/modals/SettingsHoursInDayModal.vue"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { pluralize } from "~/helpers/utils/pluralize"
import { useSiteSettingsStore } from "~/stores/site-settings"
import UiCard from '~/components/ui/UiCard.vue'

const { hoursInDay } = storeToRefs(useSiteSettingsStore())
const modal = useModal()

const hoursPlural = computed(() => {
	if (hoursInDay.value) {
		return pluralize(hoursInDay.value, hoursPluralize)
	}
})

function openModal() {
	modal.open(SettingsHoursInDayModal)
}
</script>

<template>
	<UiCard title="Часов в день">
		<div class="text-accent overflow-hidden truncate">
			{{ hoursPlural || "Выключено" }}
		</div>

		<template #footer>
			<UButton
				@click="openModal"
				label="Изменить"
			/>
		</template>
	</UiCard>
</template>

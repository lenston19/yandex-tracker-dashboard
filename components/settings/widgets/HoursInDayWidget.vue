<script setup lang="ts">
import { storeToRefs } from "pinia"
import SettingsHoursInDayModal from "~/components/settings/modals/SettingsHoursInDayModal.vue"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { pluralize } from "~/helpers/utils/pluralize"
import { useSiteSettingsStore } from "~/store/site-settings"

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const hoursPlural = computed(() => {
	if (hoursInDay.value) {
		return pluralize(hoursInDay.value, hoursPluralize)
	}
})

const dialog = ref<boolean>(false)
</script>

<template>
	<SettingsHoursInDayModal v-model="dialog" />

	<UCard>
		<template #header>
			<div class="text-xl">Часов в день</div>
		</template>

		<div class="text-accent overflow-hidden truncate">
			{{ hoursPlural || "Выключено" }}
		</div>

		<template #footer>
			<UButton
				@click="dialog = true"
				label="Изменить"
			/>
		</template>
	</UCard>
</template>

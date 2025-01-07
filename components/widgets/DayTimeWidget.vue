<script setup lang="ts">
import { DateTime } from "luxon"
import { useDayTimeWidgetStore } from "~/stores/day-time-widget"
import { useSiteSettingsStore } from "~/stores/site-settings"
import { HEROICONS } from "~/helpers/static/heroicons"

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, isLoading } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const today = computed(() => {
	return DateTime.now().toFormat("dd.MM.yyyy")
})

onMounted(async () => {
	if (!totalHours.value) {
		await dayTimeWidgetStore.refresh()
	}
})
</script>

<template>
	<UCard>
		<template #header>
			<div class="text-xl">
				Сегодня - <span class="italic">{{ today }}</span>
			</div>
		</template>
		<DayLinearProgress
			v-if="!isLoading"
			:hours="totalHours"
			:max="hoursInDay"
		/>
		<DayLinearProgress
			v-else
			:hours="null"
			loading
		/>
		<template #footer>
			<div class="flex justify-end items-center gap-4">
				<UButton
					:icon="HEROICONS.ARROW_PATH"
					:loading="isLoading"
					@click="dayTimeWidgetStore.refresh"
				/>
			</div>
		</template>
	</UCard>
</template>

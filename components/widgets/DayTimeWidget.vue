<script setup lang="ts">
import { DateTime } from "luxon"
import { storeToRefs } from "pinia"
import { useDayTimeWidgetStore } from "~/store/day-time-widget";
import { useSiteSettingsStore } from "~/store/site-settings";

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, requestStatus } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const today = computed(() => {
	return DateTime.now().toFormat("dd.MM.yyyy")
})

onMounted(async () => {
	if (!totalHours.value) {
		await dayTimeWidgetStore.refreshWorklogsDay()
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
		<DayLinearProgress v-if="requestStatus === 'success'" :hours="totalHours" :max="hoursInDay" />
		<DayLinearProgress v-else :hours="null" loading />
		<template #footer>
			<div class="flex justify-end items-center gap-4">
				<UButton
					icon="i-heroicons-arrow-path"
					:loading="requestStatus !== 'success'"
					@click="dayTimeWidgetStore.refreshWorklogsDay"
				/>
			</div>
		</template>
	</UCard>
</template>

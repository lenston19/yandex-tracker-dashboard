<script setup lang="ts">
import { DateTime } from "luxon"
import { useDayTimeWidgetStore } from "~/stores/day-time-widget"
import { useSiteSettingsStore } from "~/stores/site-settings"
import WorklogActions from "~/components/worklogs/WorklogActions.vue"
import DayLinearProgress from '~/components/widgets/ui/DayLinearProgress.vue'
import UiCard from '~/components/ui/UiCard.vue'

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, isLoading } = storeToRefs(dayTimeWidgetStore)
const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const title = computed(() => {
	return `Сегодня - <span class="italic">${DateTime.now().toFormat("dd.MM.yyyy")}</span>`
})

onMounted(async () => {
	if (!totalHours.value) {
		await dayTimeWidgetStore.refresh()
	}
})
</script>

<template>
	<UiCard :title="title">
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
			<WorklogActions
				class="w-fit ml-auto"
				:refresh="dayTimeWidgetStore.refresh"
				:loading="isLoading"
			/>
		</template>
	</UiCard>
</template>

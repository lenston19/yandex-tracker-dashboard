<script setup lang="ts">
import { DateTime } from "luxon";
import { storeToRefs } from "pinia"
import { useWeekTimeWidgetStore } from "~/store/week-time-widget";

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, weekParams, weekTotalHours, requestStatus } = storeToRefs(weekTimeWidgetStore)

const title = computed(() => {
	const dateFrom = DateTime.fromISO(weekParams.value.from)
	const dateTo = DateTime.fromISO(weekParams.value.to)
	return `Неделя ${dateFrom.toFormat("dd.MM.yyyy")}
	- ${dateTo.toFormat("dd.MM.yyyy")}`
})

onMounted(async () => {
	await weekTimeWidgetStore.refreshWorklogsWeek()
})
</script>
<template>
	<UCard>
		<template #header>
			<div class="text-xl">{{ title }}</div>
		</template>
		<div class="grid md:grid-cols-7 grid-cols-1 gap-4">
			<template v-if="requestStatus === 'success' && currentWeek.length">
				<DayLinearProgress
					v-for="day in currentWeek"
					:key="`day-${day.weekday}-${day.hours}`"
					:hours="day.hours"
				/>
			</template>
			<template v-else-if="requestStatus === 'pending'">
				<DayLinearProgress
					v-for="day in 7"
					:key="`day-${day}`"
					:hours="null"
				/>
			</template>
			<template v-else>
				<DayLinearProgress
					v-for="day in 7"
					:key="`day-${day}`"
					:hours="0"
				/>
			</template>
		</div>
		<template v-if="requestStatus === 'success'" #footer>
			<div class="flex items-center justify-between">
				<div v-if="currentWeek?.length" class="text-lg">
					Всего: <b>{{ weekTotalHours.toFixed(2) }}ч / 40ч </b>
				</div>
				<div class="flex items-center gap-4 ml-auto">
					<div class="flex items-center">
						<UButton
							icon="i-heroicons-arrow-left"
							variant="link"
							@click="weekTimeWidgetStore.prevWeek"
						/>
						<UButton
							icon="i-heroicons-arrow-right"
							variant="link"
							@click="weekTimeWidgetStore.nextWeek"
						/>
					</div>
					<UButton
						icon="i-heroicons-arrow-path"
						@click="weekTimeWidgetStore.refreshWorklogsWeek"
					/>
				</div>
			</div>
		</template>
	</UCard>
</template>

<style scoped></style>

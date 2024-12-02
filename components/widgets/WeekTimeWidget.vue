<script setup lang="ts">
import { DateTime } from "luxon";
import { storeToRefs } from "pinia"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords";
import { pluralize } from "~/helpers/utils/pluralize";
import { useSiteSettingsStore } from "~/store/site-settings";
import { useWeekTimeWidgetStore } from "~/store/week-time-widget";

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, weekParams, weekTotalHours, requestStatus } = storeToRefs(weekTimeWidgetStore)

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const title = computed(() => {
	const dateFrom = DateTime.fromISO(weekParams.value.from)
	const dateTo = DateTime.fromISO(weekParams.value.to)
	return `Неделя ${dateFrom.toFormat("dd.MM.yyyy")}
	- ${dateTo.toFormat("dd.MM.yyyy")}`
})

const maxHoursInWeek = computed(() => pluralize(hoursInDay.value ? hoursInDay.value * 5 : 40, hoursPluralize))
const currentHoursInWeek = computed(() => pluralize(+weekTotalHours.value.toFixed(2), hoursPluralize))

const isLoading = computed(() => requestStatus.value !== 'success')

onMounted(async () => {
	if (!weekTotalHours.value) {
		await weekTimeWidgetStore.refreshWorklogsWeek()
	}
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
					:max="hoursInDay"
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
		<template #footer>
			<div class="flex items-center justify-between">
				<div v-if="!isLoading" class="text-lg flex flex-wrap gap-1">
					Всего: <span class="text-md italic font-semibold">{{ currentHoursInWeek }} / {{ maxHoursInWeek }} </span>
				</div>
				<USkeleton v-else class="h-6 w-[160px]" />
				<div class="flex items-center gap-4 ml-auto">
					<div class="flex items-center">
						<UButton
							icon="i-heroicons-arrow-left"
							variant="link"
							:loading="isLoading"
							@click="weekTimeWidgetStore.prevWeek"
						/>
						<UButton
							icon="i-heroicons-arrow-right"
							variant="link"
							:loading="isLoading"
							@click="weekTimeWidgetStore.nextWeek"
						/>
					</div>
					<UButton
						icon="i-heroicons-arrow-path"
						:loading="isLoading"
						@click="weekTimeWidgetStore.refreshWorklogsWeek"
					/>
				</div>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
import { DateTime } from "luxon"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { pluralize } from "~/helpers/utils/pluralize"
import { useSiteSettingsStore } from "~/stores/site-settings"
import { useWeekTimeWidgetStore } from "~/stores/week-time-widget"
import DayLinearProgress from '~/components/ui/DayLinearProgress.vue'
import EmptyState from "~/components/ui/EmptyState.vue"
import { HEROICONS } from "~/helpers/static/heroicons"

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, params, weekTotalHours, isLoading } = storeToRefs(weekTimeWidgetStore)

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const title = computed(() => {
	const dateFrom = DateTime.fromISO(params.value.from)
	const dateTo = DateTime.fromISO(params.value.to)
	return `Неделя ${dateFrom.toFormat("dd.MM.yyyy")}
	- ${dateTo.toFormat("dd.MM.yyyy")}`
})

const maxHoursInWeek = computed(() => pluralize(hoursInDay.value ? hoursInDay.value * 5 : 40, hoursPluralize))
const currentHoursInWeek = computed(() => pluralize(+weekTotalHours.value.toFixed(2), hoursPluralize))

onMounted(async () => {
	if (!weekTotalHours.value) {
		await weekTimeWidgetStore.refresh()
	}
})
</script>

<template>
	<UCard>
		<template #header>
			<div class="text-xl">{{ title }}</div>
		</template>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			<template v-if="isLoading">
				<DayLinearProgress
					v-for="day in 7"
					:key="`day-${day}`"
					:hours="null"
				/>
			</template>
			<EmptyState
				v-else-if="!currentWeek.length"
				class="col-span-5"
			/>
			<template v-else>
				<div
					v-for="day in currentWeek"
					:key="`day-${day.weekday}-${day.hours}`"
					class="flex flex-col gap-0 cursor-pointer"
					@click="weekTimeWidgetStore.openDetailDayDialog(day)"
				>
					<div class="text-sm font-bold -mb-5 capitalize">
						{{ day.weekday }}
					</div>
					<DayLinearProgress
						:hours="day.hours"
						:max="hoursInDay"
					/>
				</div>
			</template>


		</div>
		<template #footer>
			<div class="flex items-center justify-between">
				<div
					v-if="!isLoading"
					class="text-lg flex flex-wrap gap-1"
				>
					Всего: <span class="text-md italic font-semibold">{{ currentHoursInWeek }} / {{ maxHoursInWeek }} </span>
				</div>
				<USkeleton
					v-else
					class="h-6 w-[160px]"
				/>
				<div class="flex items-center gap-4 ml-auto">
					<div class="flex items-center">
						<UButton
							:icon="HEROICONS.ARROW_LEFT"
							variant="link"
							:loading="isLoading"
							@click="weekTimeWidgetStore.prev"
						/>
						<UButton
							:icon="HEROICONS.ARROW_RIGHT"
							variant="link"
							:loading="isLoading"
							@click="weekTimeWidgetStore.next"
						/>
					</div>
					<UButton
						:icon="HEROICONS.ARROW_PATH"
						:loading="isLoading"
						@click="weekTimeWidgetStore.refresh"
					/>
				</div>
			</div>
		</template>
	</UCard>
</template>

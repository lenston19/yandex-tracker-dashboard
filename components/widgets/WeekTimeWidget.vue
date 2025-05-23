<script setup lang="ts">
import { DateTime } from 'luxon'
import { hoursPluralize } from '~/helpers/static/pluralizeArrayWords'
import { pluralize } from '~/helpers/utils/pluralize'
import { useSiteSettingsStore } from '~/stores/site-settings'
import { useWeekTimeWidgetStore } from '~/stores/week-time-widget'
import DayLinearProgress from '~/components/widgets/ui/DayLinearProgress.vue'
import WorklogActions from '~/components/worklogs/WorklogActions.vue'
import UiCard from '~/components/ui/UiCard.vue'

const weekTimeWidgetStore = useWeekTimeWidgetStore()
const { currentWeek, params, weekTotalHours, isLoading, flatQueueWorklogs, isLoadingQueue } =
	storeToRefs(weekTimeWidgetStore)

const { hoursInDay, isShowWeeklyLoading } = storeToRefs(useSiteSettingsStore())

const title = computed(() => {
	const dateFrom = DateTime.fromISO(params.value.from)
	const dateTo = DateTime.fromISO(params.value.to)
	return `Неделя ${dateFrom.toFormat('dd.MM.yyyy')}
	- ${dateTo.toFormat('dd.MM.yyyy')}`
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
	<UiCard :title="title">
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			<template v-if="isLoading">
				<DayLinearProgress
					v-for="day in 7"
					:key="`day-${day}`"
					:hours="null"
				/>
			</template>
			<template v-else>
				<div
					v-for="day in currentWeek"
					:key="`day-${day.weekday}-${day.hours}`"
					class="flex flex-col gap-0"
					:class="{
						'cursor-pointer': day.hours > 0
					}"
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
		<template v-if="flatQueueWorklogs.length && isShowWeeklyLoading && !isLoadingQueue && !isLoading">
			<UDivider class="py-4" />
			<UMeterGroup
				:min="0"
				:max="100"
				size="lg"
				:indicator="false"
				icon="i-heroicons-minus"
			>
				<template
					v-for="queue in flatQueueWorklogs"
					:key="queue.queueName"
				>
					<UMeter
						:value="queue.percentage"
						:color="queue.color"
						:label="`${queue.queueName} (${pluralize(+queue.hours.toFixed(2), hoursPluralize)})`"
					/>
				</template>
			</UMeterGroup>
		</template>
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
				<WorklogActions
					class="ml-auto"
					:loading="isLoading"
					:next="weekTimeWidgetStore.next"
					:prev="weekTimeWidgetStore.prev"
					:refresh="weekTimeWidgetStore.refresh"
					type="week"
				/>
			</div>
		</template>
	</UiCard>
</template>

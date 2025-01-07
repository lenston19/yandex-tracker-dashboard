<script setup lang="ts">
import { DateTime } from "luxon"
import LineChart from "~/components/charts/LineChart.vue"
import PieChart from "~/components/charts/PieChart.vue"
import { useMonthlyReportStore } from "~/stores/monthly-report"
import { pluralize } from "~/helpers/utils/pluralize"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { HEROICONS } from "~/helpers/static/heroicons"

definePageMeta({
	middleware: ['auth']
})

const monthlyReportStore = useMonthlyReportStore()
const { monthLineChartData, monthPieChartData, params, isLoading, averageHoursByMonth, totalHours } = storeToRefs(monthlyReportStore)

const title = computed(() =>
	DateTime.fromISO(params.value.from).toFormat("LLLL yyyy")
)

const columns = [
	{
		key: "name",
		label: "Наименование",
	},
	{
		key: "value",
		label: "Значение",
	},
]

const data = computed(() => {
	return [
		{
			name: 'Часов за месяц',
			value: pluralize(totalHours.value, hoursPluralize),
			attrs: {
				color: 'teal'
			}
		},
		{
			name: 'Среднее значение часов за месяц',
			value: pluralize(averageHoursByMonth.value, hoursPluralize),
			helpText: 'Часы за все дни / количество дней (> 15 минут)',
			attrs: {
				color: () => {
					switch (true) {
						case averageHoursByMonth.value < 5: return 'red'
						case averageHoursByMonth.value < 8: return 'yellow'
						default: return 'primary'
					}
				}
			}
		},
	]
})

onMounted(async () => {
	if (!monthLineChartData.value.datasets.length || !monthPieChartData.value.datasets.length) {
		await monthlyReportStore.refresh()
	}
})
</script>

<template>
	<div class="flex flex-col gap-5">
		<PageHeader
			:title="title"
			:loading="isLoading"
			:next="monthlyReportStore.next"
			:prev="monthlyReportStore.prev"
			:refresh="monthlyReportStore.refresh"
		/>
		<div class="grid grid-cols-2 gap-4">
			<UCard class="col-span-2">
				<template #header>
					<div class="flex flex-col gap-4">
						<div class="text-xl">
							Динамика рабочего времени по дням
						</div>
					</div>
				</template>
				<LineChart
					:loading="isLoading"
					:data="monthLineChartData"
				/>
			</UCard>
			<UCard
				class="col-span-2 lg:col-span-1"
				:ui="{
					body: {
						padding: '',
					},
				}"
			>
				<template #header>
					<div class="flex flex-col gap-4">
						<div class="text-xl">
							Статистика
						</div>
					</div>
				</template>
				<div class="flex justify-center">
					<UTable
						v-if="!isLoading"
						:rows="data"
						:columns="columns"
						class="w-full"
					>
						<template #name-data="{ row }">
							<div class="flex gap-2 items-center">
								{{ row.name }}
								<UTooltip
									:ui="{
										base: '[@media(pointer:coarse)]:block max-w-[150px] sm:max-w-[226px] !overflow-visible !text-wrap h-fit text-sm',
									}"
									v-if="row.helpText?.length"
									:text="row.helpText"
								>
									<UIcon
										:name="HEROICONS.INFORMATION_CIRCLE"
										class="w-4 h-4 cursor-help"
									/>
								</UTooltip>

							</div>
						</template>
						<template #value-data="{ row }">
							<UBadge
								size="xs"
								:label="row.value"
								v-bind="row.attrs"
							/>
						</template>
					</UTable>
					<USkeleton
						v-else
						class="w-[calc(100%-3rem)] mt-5 h-48"
					/>
				</div>

			</UCard>
			<UCard class="col-span-2 lg:col-span-1">
				<template #header>
					<div class="text-xl">
						Занятость на проектах
					</div>
				</template>
				<PieChart
					:loading="isLoading"
					:data="monthPieChartData"
				/>
			</UCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon"
import LineChart from "~/components/charts/LineChart.vue"
import PieChart from "~/components/charts/PieChart.vue"
import { useMonthlyReportStore } from "~/stores/monthly-report"
import { pluralize } from "~/helpers/utils/pluralize"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import UiCard from '~/components/ui/UiCard.vue'
import UiTooltipInfo from "~/components/ui/UiTooltipInfo.vue"

useHead({
	title: 'Месячный отчет'
})

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
			helpText: 'Часы за все\u00A0дни / количество\u00A0дней <br><span class="text-xs text-gray-300">*\u00A0минимум\u00A015\u00A0минут в день</span>',
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
			<UiCard
				title="Динамика рабочего времени по дням"
				class="col-span-2"
			>
				<LineChart
					:loading="isLoading"
					:data="monthLineChartData"
				/>
			</UiCard>
			<UiCard
				title="Статистика"
				class="col-span-2 lg:col-span-1"
				no-padding-body
			>
				<div class="flex justify-center">
					<UTable
						v-if="!isLoading"
						:rows="data"
						:columns="columns"
						class="w-full"
					>
						<template #name-data="{ row }">
							<div class="flex gap-2 items-center text-wrap">
								{{ row.name }}
								<UiTooltipInfo
									v-if="row.helpText?.length"
									:text="row.helpText"
									base-class="max-w-[226px]"
								/>
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

			</UiCard>
			<UiCard
				title="Занятость на проектах"
				class="col-span-2 lg:col-span-1"
			>
				<PieChart
					:loading="isLoading"
					:data="monthPieChartData"
				/>
			</UiCard>
		</div>
	</div>
</template>

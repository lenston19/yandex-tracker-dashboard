<script setup lang="ts">
import { DateTime } from "luxon";
import { storeToRefs } from "pinia";
import LineChart from "~/components/charts/LineChart.vue"
import PieChart from "~/components/charts/PieChart.vue"
import { useMonthlyReportStore } from "~/store/monthly-report";
import { pluralize } from "~/helpers/utils/pluralize";
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords";

definePageMeta({
	middleware: ['auth']
})

const monthlyReportStore = useMonthlyReportStore()
const { monthLineChartData, monthPieChartData, params, isLoading, averageHoursByMonth } = storeToRefs(monthlyReportStore)

const title = computed(() =>
	DateTime.fromISO(params.value.from).toFormat("LLLL yyyy")
)

const getColorByAverage = computed(() => {
	switch (true) {
		case averageHoursByMonth.value < 5: return 'red'
		case averageHoursByMonth.value < 8: return 'yellow'
		default: return 'primary'
	}
})

onMounted(async () => {
	if (!monthLineChartData.value.datasets.length || !monthPieChartData.value.datasets.length) {
		await monthlyReportStore.refresh()
	}
})
</script>

<template>
	<div class="flex flex-col gap-5">
		<div class="flex items-center justify-between ">
			<div class="text-xl capitalize">
				{{ title }}
			</div>
			<div class="flex items-center gap-4">
				<div class="flex items-center">
					<UButton
						icon="i-heroicons-arrow-left"
						variant="link"
						:loading="isLoading"
						@click="monthlyReportStore.prev"
					/>
					<UButton
						icon="i-heroicons-arrow-right"
						variant="link"
						:loading="isLoading"
						@click="monthlyReportStore.next"
					/>
				</div>
				<UButton
					icon="i-heroicons-arrow-path"
					variant="link"
					:loading="isLoading"
					@click="monthlyReportStore.refresh"
				/>
			</div>
		</div>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between gap-2">
					<div class="text-xl">
						Сводка
					</div>
					<div class="flex gap-3">
						<span class="break-words">
							Средняя за месяц
						</span>
						<UBadge
							v-if="!isLoading"
							:color="getColorByAverage"
						>
							{{ pluralize(averageHoursByMonth, hoursPluralize) }}
						</UBadge>
						<USkeleton v-else class="w-[90px] h-[25px]"/>
					</div>

				</div>
			</template>
			<LineChart
				v-if="!isLoading"
				:data="monthLineChartData"
			/>
			<USkeleton v-else class="w-full h-48"/>
		</UCard>
		<UCard class="w-full lg:w-1/2">
			<template #header>
				<div class="text-xl">
					Занятость на проектах
				</div>
			</template>
			<PieChart
				v-if="!isLoading"
				:data="monthPieChartData"
			/>
			<USkeleton v-else class="w-full h-48"/>
		</UCard>
	</div>
</template>

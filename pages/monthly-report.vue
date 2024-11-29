<script setup lang="ts">
import { DateTime } from "luxon";
import { storeToRefs } from "pinia";
import LineChart from "~/components/charts/LineChart.vue"
import { useMonthlyReportStore } from "~/store/monthly-report";

definePageMeta({
	middleware: ['auth']
})

const monthlyReportStore = useMonthlyReportStore()
const { monthChartData, monthParams, requestStatus } = storeToRefs(monthlyReportStore)

const title = computed(() =>
	DateTime.fromISO(monthParams.value.from).toFormat("LLLL yyyy")
)

const averageHoursByMonth = computed(() => {
	let count = 0
	const total = monthChartData.value.datasets[0].data.reduce((acc, item) => {
		if (item > 0.25) {
			acc += item
			count += 1
		}
		return acc
	}, 0)
	const result = +(total / count).toFixed(2)
	return isNaN(result) ? 0 : result
})

const getColorByAverage = computed(() => {
	switch (true) {
		case averageHoursByMonth.value < 5: return 'red'
		case averageHoursByMonth.value < 8: return 'yellow'
		default: return 'primary'
	}
})

const isLoading = computed(() => requestStatus.value !== 'success')

onMounted(async () => {
	if (!monthChartData.value.datasets.length) {
		await monthlyReportStore.refreshChartData()
	}
})
</script>

<template>
	<div class="flex items-center justify-between mb-5">
		<div class="text-xl capitalize">
			{{ title }}
		</div>
		<div class="flex items-center gap-4">
			<div class="flex items-center">
				<UButton
					icon="i-heroicons-arrow-left"
					variant="link"
					:loading="isLoading"
					@click="monthlyReportStore.prevMonth"
				/>
				<UButton
					icon="i-heroicons-arrow-right"
					variant="link"
					:loading="isLoading"
					@click="monthlyReportStore.nextMonth"
				/>
			</div>
			<UButton
				icon="i-heroicons-arrow-path"
				variant="link"
				:loading="isLoading"
				@click="monthlyReportStore.refreshChartData"
			/>
		</div>
	</div>
	<UCard>
		<template #header>
			<div class="flex items-center justify-between">
				<div class="text-xl">
					Сводка
				</div>
				<div class="flex gap-3">
					Средняя за промежуток
					<UBadge
						v-if="!isLoading"
						:color="getColorByAverage"
						variant="subtle"
					>
						{{ averageHoursByMonth }} ч
					</UBadge>
					<USkeleton v-else class="w-[90px] h-[25px]"/>
				</div>

			</div>
		</template>
		<LineChart
			v-if="!isLoading"
			:data="monthChartData"
			class="max-h-48"
		/>
		<USkeleton v-else class="w-full h-48"/>
	</UCard>
</template>

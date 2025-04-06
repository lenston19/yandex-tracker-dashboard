<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import { Line } from 'vue-chartjs'
import type { LineChartData } from '~/types/base'
import UiEmptyState from '~/components/ui/UiEmptyState.vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

const props = defineProps<{
	data: LineChartData
	loading: boolean
}>()

const { width } = useWindowSize()

const options = computed(() => ({
	responsive: true,
	scales: {
		y: {
			stacked: true,
			grid: {
				display: true,
				color: 'rgba(56,142,60,0.2)'
			}
		},
		x: {
			grid: {
				display: false
			}
		}
	},
	plugins: {
		legend: {
			display: false
		}
	}
}))

const hasData = computed(() => {
	return props.data.datasets.at(0)?.data.reduce((acc, hours) => acc + hours, 0)
})
</script>

<template>
	<ClientOnly>
		<USkeleton
			v-if="loading"
			class="w-full h-48"
		/>
		<Line
			v-else-if="hasData"
			:key="JSON.stringify(data) + width"
			:data="data"
			:options="options"
			class="max-h-48"
		/>
		<UiEmptyState v-else />
	</ClientOnly>
</template>

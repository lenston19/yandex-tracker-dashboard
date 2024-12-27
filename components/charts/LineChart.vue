<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
} from "chart.js"
import { Line } from "vue-chartjs"
import { LineChartData } from "~/types/base";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip
)

defineProps<{
	data: LineChartData
}>()

const { width } = useWindowSize()

const options = computed(() => ({
	responsive: true,
	scales: {
		y: {
			stacked: true,
			grid: {
				display: true,
				color: "rgba(56,142,60,0.2)",
			},
		},
		x: {
			grid: {
				display: false,
			},
		},
	},
	plugins: {
		legend: {
			display: false
		}
	},
}))
</script>

<template>
	<ClientOnly>
		<Line
			:key="JSON.stringify(data) + width"
			:data="data"
			:options="options"
			class="max-h-48"
		/>
	</ClientOnly>
</template>

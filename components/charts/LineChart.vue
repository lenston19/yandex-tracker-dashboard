<script setup lang="ts">
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
}))
</script>

<template>
	<Line :data="data" :options="options" />
</template>

<style lang="scss"></style>

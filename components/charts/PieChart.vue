<script setup lang="ts">
import {
	Chart as ChartJS,
	ArcElement, Tooltip, Legend,
} from "chart.js"
import { Pie } from 'vue-chartjs'
import { PieChartData } from "~/types/base";

ChartJS.register(
	ArcElement,
	Legend,
	Tooltip
)

defineProps<{
	data: PieChartData
}>()
</script>

<template>
	<ClientOnly>
		<Pie
			:key="JSON.stringify(data)"
			:data="data"
			:options="{
				responsive: true,
				maintainAspectRatio: false
			}"
			class="max-h-96"
		/>
	</ClientOnly>
</template>

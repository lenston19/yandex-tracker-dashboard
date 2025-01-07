<script setup lang="ts">
import {
	Chart as ChartJS,
	ArcElement, Tooltip, Legend,
} from "chart.js"
import { Pie } from 'vue-chartjs'
import { PieChartData } from "~/types/base"
import UiEmptyState from "~/components/ui/UiEmptyState.vue"

ChartJS.register(
	ArcElement,
	Legend,
	Tooltip
)

const props = defineProps<{
	data: PieChartData
	loading: boolean
}>()

const hasData = computed(() => {
	return props.data.datasets.at(0)?.data.length
})
</script>

<template>
	<ClientOnly>
		<USkeleton
			v-if="loading"
			class="w-full h-48"
		/>
		<Pie
			v-else-if="hasData"
			:key="JSON.stringify(data)"
			:data="data"
			:options="{
				responsive: true,
				maintainAspectRatio: false
			}"
			class="max-h-48"
		/>
		<UiEmptyState v-else />
	</ClientOnly>
</template>

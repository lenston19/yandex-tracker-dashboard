<!-- <script setup lang="ts">
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip
} from 'chart.js'
import { Line } from 'vue-chartjs'

export interface LineChartData {
	labels: string[];
	datasets: {
			backgroundColor: string,
			borderColor: string,
			borderWidth: number,
			hoverBackgroundColor: string,
			hoverBorderColor: string,
			data: number[];
	}[];
}

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
        color: 'rgba(56,142,60,0.2)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}))
</script>

<template>
  <Line
		:data="data"
		:options="options"
	/>
</template>


<style lang="scss">

</style> -->

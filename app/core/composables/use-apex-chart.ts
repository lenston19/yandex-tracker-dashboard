import type { ComputedRef } from 'vue'
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { LineChartData } from '~/core/types'

interface ApexChartVariant {
  type: 'line' | 'bar'
  widthMultiplier: number
  colorOf: (dataset: LineChartData['datasets'][number]) => string
  extraOptions?: Record<string, unknown>
  fill?: boolean
}

export const useApexChart = (
  data: ComputedRef<LineChartData>,
  height: ComputedRef<number | undefined>,
  variant: ApexChartVariant
) => {
  const chartHeight = computed(() => height.value ?? (variant.fill ? '100%' : 200))
  const hasData = computed(() => data.value.labels.length > 0)

  const series = computed(() =>
    data.value.datasets.map(dataset => ({
      name: 'Часы',
      data: dataset.data
    }))
  )

  const chartOptions = computed(() => ({
    chart: {
      type: variant.type,
      height: chartHeight.value,
      fontFamily: 'inherit',
      parentHeightOffset: 0,
      foreColor: '#B0B0B0',
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    grid: {
      show: true,
      strokeDashArray: 1,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    colors: data.value.datasets.map(variant.colorOf),
    dataLabels: { enabled: false },
    xaxis: {
      type: 'category' as const,
      categories: data.value.labels,
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        hideOverlappingLabels: true,
        trim: true,
        style: {
          fontSize: '10px'
        }
      }
    },
    yaxis: {
      opposite: false,
      labels: { show: true }
    },
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
        fontFamily: 'inherit'
      },
      x: { show: false }
    },
    ...variant.extraOptions
  }))

  const { isSmaller } = useBreakpoints(breakpointsTailwind)

  const chartWidth = computed(() =>
    isSmaller('md') ? Math.max(data.value.labels.length * variant.widthMultiplier, 600) : undefined
  )

  return { chartHeight, hasData, series, chartOptions, chartWidth }
}

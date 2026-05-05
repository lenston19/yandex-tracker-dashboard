import type { HeatmapWeeks } from '../types'

export function useDisplaySettings() {
  const heatmap = reactive<{
    show: boolean
    weeks: HeatmapWeeks
  }>({
    show: true,
    weeks: 53
  })

  const myIssues = reactive<{
    show: boolean
    statuses: string[]
    roles: {
      assignee: boolean
      reviewer: boolean
      qaEngineer: boolean
    }
    display: {
      priority: boolean
      status: boolean
      assignee: boolean
      reviewer: boolean
      qaEngineer: boolean
    }
  }>({
    show: true,
    roles: {
      assignee: true,
      reviewer: false,
      qaEngineer: false
    },
    display: {
      priority: true,
      status: true,
      assignee: false,
      reviewer: false,
      qaEngineer: false
    }
  })

  return {
    heatmap,
    myIssues
  }
}

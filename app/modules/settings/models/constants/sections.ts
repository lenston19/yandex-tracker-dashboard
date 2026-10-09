import type { Component } from 'vue'
import AccountSettings from '../../components/account-settings.vue'
import ThemeSettings from '../../components/theme-settings.vue'
import WorktimeSettings from '../../components/worktime-settings.vue'
import HeatmapSettings from '../../components/heatmap-settings.vue'
import MyIssuesSettings from '../../components/my-issues-settings.vue'
import DangerSettings from '../../components/danger-settings.vue'
import { HEROICONS } from '~/core/constants/heroicons'

interface SettingsSection {
  id: string
  label: string
  icon: string
  component: Component
}

export const SECTION_ACCOUNT: SettingsSection = {
  id: 'account',
  label: 'Аккаунт',
  icon: HEROICONS.USER,
  component: AccountSettings
}

export const SECTION_THEME: SettingsSection = {
  id: 'theme',
  label: 'Сезонная тема',
  icon: HEROICONS.SPARKLES,
  component: ThemeSettings
}

export const SECTION_WORKTIME: SettingsSection = {
  id: 'worktime',
  label: 'Рабочее время',
  icon: HEROICONS.CLOCK,
  component: WorktimeSettings
}

export const SECTION_HEATMAP: SettingsSection = {
  id: 'heatmap',
  label: 'График активности',
  icon: HEROICONS.CHART_BAR,
  component: HeatmapSettings
}

export const SECTION_MY_ISSUES: SettingsSection = {
  id: 'my-issues',
  label: 'Мои задачи',
  icon: HEROICONS.FOLDER,
  component: MyIssuesSettings
}

export const SECTION_DANGER: SettingsSection = {
  id: 'danger',
  label: 'Опасная зона',
  icon: HEROICONS.EXCLAMATION_TRIANGLE,
  component: DangerSettings
}

export const UNAUTH_SECTIONS = [SECTION_ACCOUNT]

export const AUTH_SECTIONS = [
  SECTION_ACCOUNT,
  SECTION_WORKTIME,
  SECTION_THEME,
  SECTION_HEATMAP,
  SECTION_MY_ISSUES,
  SECTION_DANGER
]

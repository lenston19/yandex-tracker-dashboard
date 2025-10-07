<script setup lang="ts">
import { TIME_ZONE_LIST } from '~/constants/time-zone'
import { useSiteSettingsStore } from '~/stores/use-site-settings-store'

const siteSettingsStore = useSiteSettingsStore()

const modelValue = computed(() => siteSettingsStore.timeZone)
</script>

<template>
  <u-select-menu
    :model-value="modelValue"
    :items="TIME_ZONE_LIST"
    @update:model-value="newTimeZone => siteSettingsStore.setTimeZone(newTimeZone)"
  />
</template>

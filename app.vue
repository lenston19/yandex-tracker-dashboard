<script lang="ts" setup>
import { Settings } from 'luxon'
import { useSiteSettingsStore } from '~/stores/site-settings'
import { SITEMAP } from './helpers/router/sitemap'

const siteSettingsStore = useSiteSettingsStore()
Settings.defaultLocale = 'ru'

watch(
	() => siteSettingsStore.timeZone.value,
	value => {
		Settings.defaultZone = value
	}
)

useHead({
	title: SITEMAP.main.name
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<ClientOnly>
		<UNotifications />
		<UModals />
	</ClientOnly>
</template>

<style lang="scss">
body {
	position: relative;
	width: 100%;
	min-height: 100dvh;
	overflow-x: hidden;
}

#__nuxt {
	height: 100%;
}
</style>

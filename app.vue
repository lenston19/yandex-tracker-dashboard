<script lang="ts" setup>
import { Settings } from 'luxon'

Settings.defaultZone = 'Europe/Moscow'
Settings.defaultLocale = 'ru'

useHead({
	title: 'YandexTracker Dashboard'
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

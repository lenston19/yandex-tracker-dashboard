<script setup lang="ts">
import OrganizationWidget from '~/components/settings/widgets/OrganizationWidget.vue'
import UserWidget from '~/components/settings/widgets/UserWidget.vue'
import TimeZoneWidget from '~/components/settings/widgets/TimeZoneWidget.vue'
import MainSettingsWidget from '~/components/settings/widgets/MainSettingsWidget.vue'
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
	title: SITEMAP.settings.name
})
</script>

<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
		<UserWidget />
		<OrganizationWidget />
		<TimeZoneWidget />
		<MainSettingsWidget class="col-span-auto lg:col-span-3" />
	</div>
</template>

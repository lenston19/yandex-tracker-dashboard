<script setup lang="ts">
import OrganizationWidget from "~/components/settings/widgets/OrganizationWidget.vue"
import UserWidget from "~/components/settings/widgets/UserWidget.vue"
import HoursInDayWidget from "~/components/settings/widgets/HoursInDayWidget.vue"
</script>

<template>
	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
		<UserWidget />
		<OrganizationWidget />
		<HoursInDayWidget />
		<SettingsGoldWidget />
	</div>
</template>

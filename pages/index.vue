<script setup lang="ts">
import WeekTimeWidget from "~/components/widgets/WeekTimeWidget.vue"
import DayTimeWidget from "~/components/widgets/DayTimeWidget.vue"
import MonthTimeWidget from "~/components/widgets/MonthTimeWidget.vue"
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
	title: SITEMAP.main.name
})

definePageMeta({
	middleware: ['auth']
})
</script>

<template>
	<div class="grid grid-cols-4 gap-4">
		<WeekTimeWidget class="col-span-4 order-3 md:order-1 h-fit" />
		<DayTimeWidget class="col-span-4 order-1 md:order-2 md:col-span-2 h-fit" />
		<MonthTimeWidget class="col-span-4 order-2 md:order-3 md:col-span-2 h-fit" />
	</div>
</template>

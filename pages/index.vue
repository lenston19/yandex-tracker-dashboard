<script setup lang="ts">
import WeekTimeWidget from "~/components/widgets/WeekTimeWidget.vue"
import DayTimeWidget from "~/components/widgets/DayTimeWidget.vue"
import MonthTimeWidget from "~/components/widgets/MonthTimeWidget.vue"

definePageMeta({
	middleware: ['auth']
})
</script>

<template>
	<div class="grid grid-cols-4 gap-4">
		<WeekTimeWidget class="col-span-4" />
		<DayTimeWidget class="col-span-4 md:col-span-2" />
		<MonthTimeWidget class="col-span-4 md:col-span-2" />
	</div>
</template>

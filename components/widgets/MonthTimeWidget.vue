<script setup lang="ts">
import { storeToRefs } from "pinia"
import { useMonthTimeWidgetStore } from "~/store/month-time-widget";

const monthTimeWidgetStore = useMonthTimeWidgetStore()
const { totalHours, requestStatus } = storeToRefs(monthTimeWidgetStore)

onMounted(async () => {
	await monthTimeWidgetStore.refreshWorklogsMonth()
})
</script>

<template>
	<UCard>
		<template #header>
			<div class="text-xl">Сводка месяца</div>
		</template>
		<DayLinearProgress
			v-if="requestStatus === 'success'"
			:hours="totalHours"
			:max="totalHours"
		/>
		<DayLinearProgress
			v-else
			:hours="null"
		/>
		<template v-if="requestStatus === 'success'" #footer>
			<div class="flex items-center gap-4 justify-end">
				<UButton
					icon="i-heroicons-arrow-path"
					@click="monthTimeWidgetStore.refreshWorklogsMonth"
				/>
			</div>
		</template>
	</UCard>
</template>

<style scoped></style>

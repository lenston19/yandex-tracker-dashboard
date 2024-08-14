<script setup lang="ts">
import { DateTime } from "luxon"
import { storeToRefs } from "pinia"
import { useDayTimeWidgetStore } from "~/store/day-time-widget";

const dayTimeWidgetStore = useDayTimeWidgetStore()
const { totalHours, requestStatus } = storeToRefs(dayTimeWidgetStore)

const today = computed(() => {
	return DateTime.now().toFormat("dd.MM.yyyy")
})

onMounted(async () => {
	await dayTimeWidgetStore.refreshWorklogsDay()
})
</script>

<template>
	<UCard>
		<template #header>
			<div class="text-xl">
				Сегодня - <span class="italic">{{ today }}</span>
			</div>
		</template>
		<DayLinearProgress v-if="requestStatus === 'success'" :hours="totalHours" />
		<DayLinearProgress v-else :hours="null" loading />
		<template v-if="requestStatus === 'success'" #footer>
			<div class="flex justify-end items-center gap-4">
				<UButton
					icon="i-heroicons-arrow-path"
					@click="dayTimeWidgetStore.refreshWorklogsDay"
				/>
			</div>
		</template>
	</UCard>
</template>

<style scoped></style>

<script setup lang="ts">
import { useMonthTimeWidgetStore } from "~/stores/month-time-widget"
import { useSiteSettingsStore } from "~/stores/site-settings"
import { formatRUB } from "~/helpers/utils/format-money"
import { HEROICONS } from "~/helpers/static/heroicons"

const monthTimeWidgetStore = useMonthTimeWidgetStore()

const { totalHours, isLoading } = storeToRefs(monthTimeWidgetStore)
const { needHoursInCurrentMonth, gold } = storeToRefs(useSiteSettingsStore())

const currentRuble = computed(() => totalHours.value * gold.value)
const maxRuble = computed(() => needHoursInCurrentMonth.value ? needHoursInCurrentMonth.value * gold.value : currentRuble.value)

onMounted(async () => {
	if (!totalHours.value) {
		await monthTimeWidgetStore.refresh()
	}
})
</script>

<template>
	<UCard>
		<template #header>
			<div class="text-xl">Сводка месяца</div>
		</template>
		<div class="space-y-3">
			<DayLinearProgress
				v-if="!isLoading"
				:hours="totalHours"
				:max="needHoursInCurrentMonth"
				show-max
			/>
			<DayLinearProgress
				v-else
				:hours="null"
			/>

			<UProgress
				v-if="gold"
				:value="currentRuble"
				:min="0"
				:max="maxRuble"
				color="blue"
				animation="swing"
			>
				<template #indicator>
					<div
						v-if="!isLoading"
						class="text-sm text-right font-bold"
					>
						{{ formatRUB(currentRuble) }} / {{ formatRUB(maxRuble) }}
					</div>
					<USkeleton
						v-else
						class="ml-auto w-[100px] h-6"
					/>
				</template>
			</UProgress>
		</div>
		<template #footer>
			<div class="flex items-center gap-4 justify-end">
				<UButton
					:icon="HEROICONS.ARROW_PATH"
					:loading="isLoading"
					@click="monthTimeWidgetStore.refresh"
				/>
			</div>
		</template>
	</UCard>
</template>

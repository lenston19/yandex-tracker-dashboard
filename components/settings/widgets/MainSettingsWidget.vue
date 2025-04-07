<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/site-settings'
import UiCard from '~/components/ui/UiCard.vue'
import SettingsGoldModal from '~/components/settings/modals/SettingsGoldModal.vue'
import { formatRUB } from '~/helpers/utils/format-money'
import SettingsHoursInDayModal from '~/components/settings/modals/SettingsHoursInDayModal.vue'
import { hoursPluralize } from '~/helpers/static/pluralizeArrayWords'
import { pluralize } from '~/helpers/utils/pluralize'

const { isShowWeeklyLoading, gold, hoursInDay } = storeToRefs(useSiteSettingsStore())
const modal = useModal()

const hoursPlural = computed(() => {
	if (!hoursInDay.value) {
		return 'Выключено'
	}
	return pluralize(hoursInDay.value, hoursPluralize)
})

function openHoursModal() {
	modal.open(SettingsHoursInDayModal)
}

function openGoldModal() {
	modal.open(SettingsGoldModal)
}
</script>

<template>
	<UiCard title="Основные настройки">
		<div class="flex flex-col gap-3">
			<UFormGroup label="Часов в день">
				<div class="flex items-center justify-between gap-2">
					<div class="text-accent overflow-hidden truncate">
						{{ hoursPlural }}
					</div>

					<UButton
						label="Изменить"
						@click="openHoursModal"
					/>
				</div>
			</UFormGroup>
			<UDivider />
			<UFormGroup label="Ставка">
				<div class="flex items-center justify-between gap-2">
					<div class="text-accent overflow-hidden truncate">
						{{ formatRUB(gold) || 'Пусто' }}
					</div>

					<UButton
						label="Изменить"
						@click="openGoldModal"
					/>
				</div>
			</UFormGroup>
			<UDivider />
			<UFormGroup
				label="Недельная загруженность"
				help="Демонстрация потраченного времени на каждый проект в течении недели"
			>
				<UToggle
					v-model="isShowWeeklyLoading"
					on-icon="i-heroicons-check-20-solid"
					off-icon="i-heroicons-x-mark-20-solid"
				/>
			</UFormGroup>
		</div>
	</UiCard>
</template>

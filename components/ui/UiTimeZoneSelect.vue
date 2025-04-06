<script setup lang="ts">
import { TIME_ZONE_LIST } from '~/helpers/static/timeZone'
import type { TimeZoneSelectOption } from '~/types/base'
import type { Group } from '#ui/types'
import { HEROICONS } from '~/helpers/static/heroicons'
import { useSiteSettingsStore } from '~/stores/site-settings'

const siteSettingsStore = useSiteSettingsStore()

const groups = computed<Group[]>(() => [
	{
		key: 'timezones',
		commands: TIME_ZONE_LIST
	}
])

const modelValue = computed(() => {
	return siteSettingsStore.timeZone ? [siteSettingsStore.timeZone] : []
})

function selectTimezone(value: TimeZoneSelectOption[], closeFn: () => void) {
	// Чтобы не было автовыбора первого значения при blur на элементе
	// https://github.com/nuxt/ui/issues/1981#issuecomment-2249774608
	const newTimeZone = value.at(-1)
	if (newTimeZone) {
		siteSettingsStore.setTimeZone(newTimeZone)
	}
	closeFn()
}
</script>

<template>
	<UPopover
		:ui="{
			container: 'max-w-[300px] sm:max-w-[350px] w-full'
		}"
		overlay
		:popper="{
			placement: 'top',
			offsetDistance: 12
		}"
	>
		<UButton
			color="white"
			size="lg"
			truncate
			block
			:trailing-icon="HEROICONS.CHEVRON_DOWN_20_SOLID"
			:label="siteSettingsStore.timeZone.id"
		/>
		<template #panel="{ close }">
			<UiCard no-padding-body>
				<UCommandPalette
					:model-value="modelValue"
					multiple
					placeholder="Введите временную зону"
					command-attribute="id"
					:debounce="1000"
					:groups="groups"
					icon=""
					:ui="{
						wrapper: 'max-h-[256px] px-1 rounded-md bg-transparent',
						container: 'divide-gray-100 dark:divide-gray-100'
					}"
					@update:model-value="selectTimezone($event, close)"
				>
					<template #empty-state>
						<div class="p-4 text-sm font-semibold">Такой временной зоны нет в списке</div>
					</template>
				</UCommandPalette>
			</UiCard>
		</template>
	</UPopover>
</template>

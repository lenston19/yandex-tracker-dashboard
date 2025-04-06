<script setup lang="ts">
import { HEROICONS } from '~/helpers/static/heroicons'

export interface WorklogActionsProps {
	next?: () => Promise<void> | void
	prev?: () => Promise<void> | void
	refresh: () => Promise<void> | void
	type?: WorklogFormat
	loading: boolean
}

const props = defineProps<WorklogActionsProps>()

const prevText = computed(() => {
	switch (props.type) {
		case 'day':
			return 'Предыдущий день'
		case 'week':
			return 'Предыдущая неделя'
		case 'month':
			return 'Предыдущий месяц'

		default:
			return ''
	}
})

const nextText = computed(() => {
	switch (props.type) {
		case 'day':
			return 'Следующий день'
		case 'week':
			return 'Следующая неделя'
		case 'month':
			return 'Следующий месяц'

		default:
			return ''
	}
})

const refreshText = computed(() => {
	switch (props.type) {
		case 'day':
			return 'Обновить день'
		case 'week':
			return 'Обновить неделю'
		case 'month':
			return 'Обновить месяц'

		default:
			return ''
	}
})
</script>

<template>
	<div class="flex items-center gap-4">
		<div
			v-if="prev || next"
			class="flex items-center"
		>
			<UTooltip
				v-if="prev"
				:text="prevText"
			>
				<UButton
					:icon="HEROICONS.ARROW_LEFT"
					variant="link"
					:loading="loading"
					@click="prev"
				/>
			</UTooltip>
			<UTooltip
				v-if="next"
				:text="nextText"
			>
				<UButton
					:icon="HEROICONS.ARROW_RIGHT"
					variant="link"
					:loading="loading"
					@click="next"
				/>
			</UTooltip>
		</div>
		<UTooltip :text="refreshText">
			<UButton
				:icon="HEROICONS.ARROW_PATH"
				:loading="loading"
				@click="refresh"
			/>
		</UTooltip>
	</div>
</template>

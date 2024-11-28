<script setup lang="ts">
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { pluralize } from "~/helpers/utils/pluralize"

const props = withDefaults(
	defineProps<{
		hours?: number | null
		min?: number
		max?: number
	}>(),
	{
		hours: null,
		min: 0,
		max: 8,
	}
)

enum DayLinearColor {
	GREEN = 'green',
	RED = 'red',
	YELLOW = 'yellow'
}

const computedColor = computed(() => {
	if (props.hours === null) {
		return DayLinearColor.GREEN
	} else if (props.hours < 2) {
		return DayLinearColor.RED
	} else if (props.hours < props.max) {
		return DayLinearColor.YELLOW
	}
})

const hoursPlural = computed(() => {
	return props.hours !== null ? pluralize(props.hours, hoursPluralize) : ''
})
</script>

<template>
	<UProgress
		:value="hours"
		:min="min"
		:max="max"
		:color="computedColor"
		animation="swing"
	>
		<template v-if="hours !== null && hours >= 0" #indicator="{ percent }">
			<div class="text-sm text-right">
				{{ hoursPlural }} ({{ Number.isNaN(percent) ? 0 : Math.floor(percent) }}%)
			</div>
		</template>
	</UProgress>
</template>

<style scoped></style>

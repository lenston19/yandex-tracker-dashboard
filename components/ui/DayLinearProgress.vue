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

const computedColor = computed(() => {
	switch (true) {
		case props.hours !== null && props.hours < 2: return "red"
		case props.hours !== null && props.hours < props.max: return "yellow"
		default: return "green"
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
				{{ hoursPlural }} ({{ Math.round(percent) }}%)
			</div>
		</template>
	</UProgress>
</template>

<style scoped></style>

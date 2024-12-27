<script setup lang="ts">
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import { pluralize } from "~/helpers/utils/pluralize"

const props = withDefaults(
	defineProps<{
		hours?: number | null
		min?: number
		max?: number,
		showMax?: boolean
	}>(),
	{
		hours: null,
		min: 0,
		max: 8,
		showMax: false
	}
)

const computedMax = computed(() => props.max === 0 ? 8 : props.max)

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

const maxPlural = computed(() => {
	return props.max > 0 && props.showMax ? `/ ${pluralize(props.max, hoursPluralize)}` : ''
})
</script>

<template>
	<UProgress
		:value="hours"
		:min="min"
		:max="computedMax"
		:color="computedColor"
		animation="swing"
	>
		<template #indicator="{ percent }">
				<component
					v-if="hours !== null && hours >= 0" :is="showMax ? 'div' : 'UTooltip'"
					:text="`Максимально ${pluralize(computedMax, hoursPluralize)}`"
					class="text-sm text-right font-bold ml-auto flex gap-1"
				>
					{{ hoursPlural }} {{ maxPlural }}
					<span class="italic font-normal">
						({{ Number.isNaN(percent) ? 0 : Math.floor(percent) }}%)
					</span>
				</component>
			<USkeleton
				v-else
				class="ml-auto h-[20px] w-[100px]"
			/>
		</template>
	</UProgress>
</template>

<script setup lang="ts">
import WorklogActions, { type WorklogActionsProps } from '~/components/worklogs/WorklogActions.vue'

defineProps<
	{
		title: string
	} & WorklogActionsProps
>()
</script>

<template>
	<div class="flex items-center justify-between">
		<div class="text-xl capitalize">
			{{ title }}
		</div>
		<WorklogActions
			:loading="loading"
			:next="next"
			:prev="prev"
			:refresh="refresh"
			type="month"
		/>
	</div>
</template>

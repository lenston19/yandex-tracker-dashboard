<script setup lang="ts">
const props = withDefaults(defineProps<{
	pageCount?: number
	total: number
	color?: string
}>(), {
	pageCount: 5,
	color: 'primary'
})

const page = defineModel<number>({ default: 1 })
</script>

<template>
	<div
		class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
	>
		<UPagination
			v-model="page"
			:page-count="pageCount"
			:total="total"
			:activeButton="{ color: props.color }"
			:inactive-button="{ color: props.color }"
			:ui="{
				wrapper: 'flex items-center gap-1',
				rounded: '!rounded-full min-w-[32px] justify-center',
				default: {
					activeButton: {
						variant: 'outline'
					}
				}
			}"
		/>
	</div>
</template>

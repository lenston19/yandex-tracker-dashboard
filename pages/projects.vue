<script setup lang="ts">
import { DateTime } from "luxon"
import { storeToRefs } from "pinia";
import { useProjectsStore } from "~/store/projects";
import GroupedWorklogsTable from '~/components/worklogs/GroupedWorklogsTable.vue'

definePageMeta({
	middleware: ['auth']
})

const projectsStore = useProjectsStore()

const { queueWorklogs, isLoading } = storeToRefs(projectsStore)

const title = computed(() =>
	DateTime.now().startOf("month").toFormat("LLLL yyyy")
)
</script>

<template>
	<div class="flex items-center justify-between mb-5">
		<div class="text-xl capitalize">
			{{ title }}
		</div>
		<div class="flex items-center gap-4">
			<div class="flex items-center">
				<UButton
					icon="i-heroicons-arrow-left"
					variant="link"
					@click="projectsStore.prev"
				/>
				<UButton
					icon="i-heroicons-arrow-right"
					variant="link"
					@click="projectsStore.next"
				/>
			</div>
			<UButton
				icon="i-heroicons-arrow-path"
				variant="link"
				@click="projectsStore.refresh"
			/>
		</div>
	</div>
	<div class="grid grid-cols-1 gap-12">
		<template v-if="!isLoading">
			<UCard
				class="col-span-1"
				v-for="queue in queueWorklogs"
				:key="queue.queueName"
			>
				<GroupedWorklogsTable
					:title="queue.queueName"
					:rows="queue.worklogs"
					:page-count="10"
					showTotal
				/>
			</UCard>
		</template>
		<template v-else>
			<UCard  v-for="_ in 3">
				<USkeleton class="h-24 w-full"/>
			</UCard>
		</template>
	</div>
</template>

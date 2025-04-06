<script setup lang="ts">
import { DateTime } from 'luxon'
import { useProjectsStore } from '~/stores/projects'
import GroupedWorklogsTable from '~/components/worklogs/GroupedWorklogsTable.vue'
import UiEmptyState from '~/components/ui/UiEmptyState.vue'
import UiCard from '~/components/ui/UiCard.vue'
import { SITEMAP } from '~/helpers/router/sitemap/index'

useHead({
	title: SITEMAP.projects.name
})

definePageMeta({
	middleware: ['auth']
})

const projectsStore = useProjectsStore()

const { queueWorklogs, isLoading, params } = storeToRefs(projectsStore)

const title = computed(() => DateTime.fromISO(params.value.from).toFormat('LLLL yyyy'))
</script>

<template>
	<div class="flex flex-col gap-5">
		<PageHeader
			:title="title"
			:loading="isLoading"
			:next="projectsStore.next"
			:prev="projectsStore.prev"
			:refresh="projectsStore.refresh"
		/>
		<div class="grid grid-cols-1 gap-12">
			<template v-if="isLoading">
				<UiCard v-for="_ in 3">
					<USkeleton class="h-24 w-full" />
				</UiCard>
			</template>
			<UiEmptyState v-else-if="!queueWorklogs.length" />
			<template v-else>
				<UiCard
					v-for="queue in queueWorklogs"
					:key="queue.queueName"
					class="col-span-1"
				>
					<GroupedWorklogsTable
						:title="queue.queueName"
						:rows="queue.worklogs"
						:page-count="10"
						show-total
					/>
				</UiCard>
			</template>
		</div>
	</div>
</template>

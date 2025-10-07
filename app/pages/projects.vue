<script setup lang="ts">
import { DateTime } from 'luxon'
import { useProjectsStore } from '~/stores/use-projects-store'
import GroupedWorklogsTable from '~/components/worklogs/GroupedWorklogsTable.vue'
import UiEmptyState from '~/components/ui/UiEmptyState.vue'
import { SITEMAP } from '~/helpers/router/sitemap/index'
import UiPageHeader from '~/components/ui/UiPageHeader.vue'
import UiCard from '~/components/ui/UiCard.vue'

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
    <ui-page-header
      :title="title"
      :loading="isLoading"
      :next="projectsStore.next"
      :prev="projectsStore.prev"
      :refresh="projectsStore.refresh"
    />
    <div class="grid grid-cols-1 gap-12">
      <template v-if="isLoading">
        <ui-card
          v-for="index in 3"
          :key="index"
        >
          <u-skeleton class="h-24 w-full" />
        </ui-card>
      </template>
      <ui-empty-state v-else-if="!queueWorklogs.length" />
      <template v-else>
        <grouped-worklogs-table
          v-for="queue in queueWorklogs"
          :key="queue.queueName"
          :title="queue.queueName"
          :rows="queue.worklogs"
          :page-count="10"
          show-total
          class="col-span-1"
        />
      </template>
    </div>
  </div>
</template>

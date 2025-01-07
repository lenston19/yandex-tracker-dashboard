<script setup lang="ts">
import {
	calculateTotalHours,
	formatHoursToHHMMSS,
} from "~/helpers/utils/time"
import WorklogsTable from "~/components/worklogs/WorklogsTable.vue"
import { CollectedWorklog } from "~/helpers/utils/collecting"
import BasePagination from "../ui/BasePagination.vue"

const props = withDefaults(
	defineProps<{
		rows: CollectedWorklog[]
		title?: string
		showTotal: boolean
		pageCount?: number
	}>(),
	{
		showTotal: false,
		pageCount: 5
	}
)

const expand = ref({
	openedRows: [],
	row: null,
})

const getTotalTime = (row: CollectedWorklog) => formatHoursToHHMMSS(calculateTotalHours(row.items))

const columns = [
	{
		key: "key",
		label: "Задача",
	},
	{
		key: "totalTime",
		label: "Всего времени",
	},
]

const page = ref(1)
const data = computed(() => {
	return props.rows.slice((page.value - 1) * props.pageCount, (page.value) * props.pageCount)
})

const calcByProject = (rows: CollectedWorklog[]) => {
	if (!props.showTotal) {
		return
	}
	const total = rows.reduce((acc, item) => {
		acc += calculateTotalHours(item.items)
		return acc
	}, 0)
	return formatHoursToHHMMSS(total)
}
</script>

<template>
	<div class="flex flex-col gap-3">
		<div class="flex justify-between items-center">
			<div
				v-if="title"
				class="text-lg font-bold"
			>
				{{ title }}
			</div>
			<div v-if="showTotal">
				Всего:
				<span class="font-bold">
					{{ calcByProject(rows) }}
				</span>
			</div>
		</div>
		<UTable
			v-model:expand="expand"
			:rows="data"
			:columns="columns"
		>
			<template #totalTime-data="{ row }">
				<UBadge
					size="xs"
					:label="getTotalTime(row)"
					color="emerald"
					variant="subtle"
				/>
			</template>
			<template #expand="{ row }">
				<WorklogsTable :worklogs="row.items" />
			</template>
		</UTable>

		<BasePagination
			v-model="page"
			:total="rows.length"
			:page-count="pageCount"
		/>
	</div>
</template>

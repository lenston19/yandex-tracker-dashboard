<script setup lang="ts">
import { DateTime } from "luxon"
import { calculateWorklogTimeByDay } from "~/helpers/utils/time"
import { Yandex } from "~/types/yandex-tracker/yandex-tracker.entity"
import UiPagination from "~/components/ui/UiPagination.vue"

const props = defineProps<{
	worklogs: Yandex.Worklog[]
}>()


const getKey = (row: Yandex.Worklog) => row.issue.key
const getName = (row: Yandex.Worklog) => row.issue.display
const getTime = (row: Yandex.Worklog) => calculateWorklogTimeByDay(row)
const getDateCreatedAt = (row: Yandex.Worklog) => DateTime.fromISO(row.start).toFormat('dd.MM.yyyy')
const getTimeCreatedAt = (row: Yandex.Worklog) => DateTime.fromISO(row.start).toFormat('HH:mm:ss')

const page = ref<number>(1)
const pageCount = 5
const rows = computed(() => {
	return props.worklogs.slice((page.value - 1) * pageCount, (page.value) * pageCount)
})

const columns = [
	{
		key: "name",
		label: "Наименование задачи",
	},
	{
		key: "time",
		label: "Потраченное время",
	},
	{
		key: "dateCreatedAt",
		label: "Дата",
	},
	{
		key: "timeCreatedAt",
		label: "Время",
	},
	{
		key: "comment",
		label: "Комментарий",
	},
]
</script>

<template>
	<UTable
		:rows="rows"
		:columns="columns"
		:ui="{
			th: {
				base: 'whitespace-nowrap w-fit [&:nth-child(2)]:max-w-[200px]'
			},
			td: {
				base: ''
			}
		}"
	>
		<template #key-data="{ row }">
			{{ getKey(row) }}
		</template>
		<template #name-data="{ row }">
			<div class="">
				{{ getName(row) }}
			</div>
		</template>
		<template #time-data="{ row }">
			<UBadge
				size="xs"
				:label="getTime(row)"
				color="violet"
				variant="subtle"
			/>
		</template>
		<template #dateCreatedAt-data="{ row }">
			{{ getDateCreatedAt(row) }}
		</template>
		<template #timeCreatedAt-data="{ row }">
			{{ getTimeCreatedAt(row) }}
		</template>
	</UTable>

	<UiPagination
		v-model="page"
		:total="rows.length"
		color="violet"
	/>
</template>

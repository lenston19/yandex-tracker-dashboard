<script setup lang="ts">
import { collectWorklogs } from "~/helpers/utils/collecting"
import { Weekday } from "~/stores/week-time-widget"
import GroupedWorklogsTable from "~/components/worklogs/GroupedWorklogsTable.vue"
import { pluralize } from "~/helpers/utils/pluralize"
import { hoursPluralize } from "~/helpers/static/pluralizeArrayWords"
import UiCard from '~/components/ui/UiCard.vue'

const props = defineProps<{
	day: Weekday
}>()

const worklogs = computed(() => {
	return collectWorklogs(props.day.items).result
})

const dayTotalHours = computed(() =>
	pluralize(props.day.hours, hoursPluralize)
)

function close () {
	useModal().close()
}
</script>

<template>
	<UModal :ui="{
		width: 'w-full sm:max-w-4xl'
	}">
		<UiCard
			class="min-w-full  md:min-w-[800px]"
			no-padding-body
		>
			<template #header>
				<div class="flex justify-between">
					<span class="text-xl font-bold">
						{{ day.monthDay }}
					</span>
					<div class="text-lg">
						Часов за день:
						<span class="font-bold">
							{{ dayTotalHours }}
						</span>
					</div>
				</div>
			</template>
			<GroupedWorklogsTable :rows="worklogs" />
			<template #footer>
				<div class="flex justify-end">
					<UButton
						@click="close()"
						label="Закрыть"
					/>
				</div>
			</template>
		</UiCard>
	</UModal>
</template>

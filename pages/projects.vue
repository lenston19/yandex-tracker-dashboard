<script setup lang="ts">
import { DateTime } from "luxon"

definePageMeta({
	middleware: ['auth']
})

const title = computed(() =>
	DateTime.now().startOf("month").toFormat("LLLL yyyy")
)

const columns = [
	{
		key: "id",
		label: "ID",
	},
	{
		key: "name",
		label: "Name",
	},
	{
		key: "title",
		label: "Title",
	},
	{
		key: "email",
		label: "Email",
	},
	{
		key: "role",
		label: "Role",
	},
]

const people = [
	{
		id: 1,
		name: "Lindsay Walton",
		title: "Front-end Developer",
		email: "lindsay.walton@example.com",
		role: "Member",
	},
	{
		id: 2,
		name: "Courtney Henry",
		title: "Designer",
		email: "courtney.henry@example.com",
		role: "Admin",
	},
	{
		id: 3,
		name: "Tom Cook",
		title: "Director of Product",
		email: "tom.cook@example.com",
		role: "Member",
	},
	{
		id: 4,
		name: "Whitney Francis",
		title: "Copywriter",
		email: "whitney.francis@example.com",
		role: "Admin",
	},
	{
		id: 5,
		name: "Leonard Krasner",
		title: "Senior Designer",
		email: "leonard.krasner@example.com",
		role: "Owner",
	},
	{
		id: 6,
		name: "Floyd Miles",
		title: "Principal Designer",
		email: "floyd.miles@example.com",
		role: "Member",
	},
]
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
				/>
				<UButton
					icon="i-heroicons-arrow-right"
					variant="link"
				/>
			</div>
			<UButton
				icon="i-heroicons-arrow-path"
				variant="link"
			/>
		</div>
	</div>
	<div class="grid grid-cols-1 gap-12">
		<UCard v-for="item in 4" :key="item">
			<template #header>
				<div class="text-xl">Проект {{ item }}</div>
			</template>
			<UTable :columns="columns" :rows="people">
				<template #expand="{ row }">
					<div class="p-4">
						<pre>{{ row }}</pre>
					</div>
				</template>
			</UTable>
		</UCard>
	</div>
</template>

<style lang="scss"></style>

<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/site-settings'
import { number, object } from 'yup'

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const model = defineModel<boolean>()

const schema = object({
	hours: number()
		.transform((value: number | string) => (Number.isNaN(value) || typeof +value !== 'number' ? null : value))
		.min(0, 'Минимальное значение 0')
		.required('Поле обязательное'),
})

const state = reactive({
	hours: hoursInDay.value >= 0 ? hoursInDay.value : 8
})

const save = () => {
	hoursInDay.value = state.hours
	model.value = false
}
</script>

<template>
	<UModal v-model="model">
		<UCard>
			<template #header>
				<div class="flex flex-col gap-3">
					<div class="text-lg">
						Введите количество часов, которые вы работаете в день
					</div>
					<div class="text-sm">
						* С помощью этой функции вам будет видно в виджете месяца <span class="italic">(на главной)</span>, сколько
						вам необходимо часов в этом месяце
					</div>
					<div class="text-sm">
						** <strong>0</strong> - Отключает эту функцию
					</div>
				</div>
			</template>

			<UForm
				:schema="schema"
				:state="state"
				@submit="save"
				class="space-y-4"
			>
				<UFormGroup
					label="Часы"
					name="hours"
				>
					<UInput
						v-model.number="state.hours"
						type="number"
						color="primary"
						variant="outline"
					/>
				</UFormGroup>
				<UButton
					label="Сохранить"
					type="submit"
				/>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { useSiteSettingsStore } from '~/stores/site-settings'
import { number, object } from 'yup'
import UiCard from '~/components/ui/UiCard.vue'

const { gold } = storeToRefs(useSiteSettingsStore())

const model = defineModel<boolean>()

const schema = object({
	money: number()
		.transform((value: number | string) => (Number.isNaN(value) || typeof +value !== 'number' ? null : value))
		.min(0, 'Минимальное значение 0')
		.required('Поле обязательное')
})

const state = reactive({
	money: gold.value >= 0 ? gold.value : 8
})

const save = () => {
	gold.value = state.money
	model.value = false
}
</script>

<template>
	<UModal v-model="model">
		<UiCard title="Введите ставку">
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="save"
			>
				<UFormGroup
					label="Ставка"
					name="money"
				>
					<UInput
						v-model.number="state.money"
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
		</UiCard>
	</UModal>
</template>

<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { number, object } from 'yup'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

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
  <modal-base v-model="model">
    <ui-card title="Введите ставку">
      <u-form
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="save"
      >
        <u-form-field
          label="Ставка"
          name="money"
          class="w-full"
        >
          <u-input
            v-model.number="state.money"
            type="number"
            color="success"
            variant="outline"
            class="w-full"
          />
        </u-form-field>
        <div class="flex justify-end">
          <u-button
            label="Сохранить"
            type="submit"
          />
        </div>
      </u-form>
    </ui-card>
  </modal-base>
</template>

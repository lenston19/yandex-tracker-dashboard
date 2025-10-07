<script setup lang="ts">
import { useSiteSettingsStore } from '~/modules/settings/store/use-site-settings-store'
import { number, object } from 'yup'
import ModalBase from '~/core/components/modal/modal-base.vue'
import UiCard from '~/core/components/ui/ui-card.vue'

const { hoursInDay } = storeToRefs(useSiteSettingsStore())

const model = defineModel<boolean>()

const schema = object({
  hours: number()
    .transform((value: number | string) => (Number.isNaN(value) || typeof +value !== 'number' ? null : value))
    .min(0, 'Минимальное значение 0')
    .required('Поле обязательное')
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
  <modal-base v-model="model">
    <ui-card>
      <template #header>
        <div class="flex flex-col gap-3">
          <div class="text-lg">Введите количество часов, которые вы работаете в день</div>
          <div class="text-sm">
            * С помощью этой функции вам будет видно в виджете месяца <span class="italic">(на главной)</span>, сколько
            вам необходимо часов в этом месяце
          </div>
          <div class="text-sm">** <strong>0</strong> - Отключает эту функцию</div>
        </div>
      </template>

      <u-form
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="save"
      >
        <u-form-field
          label="Часы"
          name="hours"
        >
          <u-input
            v-model.number="state.hours"
            type="number"
            color="primary"
            variant="outline"
          />
        </u-form-field>
        <u-button
          label="Сохранить"
          type="submit"
        />
      </u-form>
    </ui-card>
  </modal-base>
</template>

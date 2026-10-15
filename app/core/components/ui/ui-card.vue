<script setup lang="ts">
interface CardUi {
  root?: string
  header?: string
  body?: string
  footer?: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    fill?: boolean
    ui?: CardUi
  }>(),
  { fill: false }
)

const cardUi = computed<CardUi>(() => ({
  root: props.ui?.root ?? (props.fill ? 'overflow-visible flex h-full flex-col' : 'overflow-visible'),
  header: props.ui?.header ?? 'p-3 sm:px-4 sm:py-3',
  body: props.ui?.body ?? (props.fill ? 'flex flex-1 flex-col min-h-0 p-3 sm:p-4' : 'p-3 sm:p-4'),
  footer: props.ui?.footer ?? 'p-3 sm:px-4 sm:py-3'
}))
</script>

<template>
  <u-card :ui="cardUi">
    <template
      v-if="title || $slots.header || $slots.actions"
      #header
    >
      <div class="flex items-center justify-between gap-2">
        <div
          v-if="title"
          class="flex items-center gap-2 text-base font-medium"
        >
          {{ title }}
          <span
            v-if="subtitle"
            class="flex items-center gap-2 font-normal text-muted"
          >
            <span class="size-1 rounded-full bg-(--ui-text-muted)" /> {{ subtitle }}
          </span>
        </div>
        <slot
          v-if="$slots.header"
          name="header"
        />
        <slot
          v-if="$slots.actions"
          name="actions"
        />
      </div>
    </template>
    <slot v-if="$slots.default" />
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
  </u-card>
</template>

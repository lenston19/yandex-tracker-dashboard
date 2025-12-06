<script setup lang="ts">
defineProps<{ title?: string }>()
</script>

<template>
  <u-card
    :ui="{
      root: 'overflow-visible'
    }"
  >
    <template
      v-if="title || $slots.header"
      #header
    >
      <div
        v-if="title"
        class="text-xl font-bold"
      >
        {{ title }}
      </div>
      <slot
        v-if="$slots.header"
        name="header"
      />
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

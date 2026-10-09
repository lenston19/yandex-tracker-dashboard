<script setup lang="ts">
const props = defineProps<{
  light: [string, string, string]
  dark: [string, string, string]
}>()

const colorMode = useColorMode()
const colors = computed(() => (colorMode.value === 'dark' ? props.dark : props.light))

const backgroundImage = computed(
  () =>
    `radial-gradient(ellipse 60% 42% at 0% 0%, ${colors.value[0]}, transparent 70%), ` +
    `radial-gradient(ellipse 60% 42% at 100% 0%, ${colors.value[1]}, transparent 70%), ` +
    `radial-gradient(ellipse 70% 52% at 50% 100%, ${colors.value[2]}, transparent 70%)`
)
</script>

<template>
  <div
    class="absolute inset-0"
    :style="{ backgroundImage }"
  />
</template>

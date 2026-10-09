<script setup lang="ts">
import snowflake from '~/assets/theme/new-year/snowflake.gif'
import { useSiteSettingsStore } from '~/modules/settings'
import { useFallingParticles } from '~/core/composables/use-falling-particles'
import { useResponsiveCount } from '~/core/composables/use-responsive-count'
import { useThemeCursor } from '~/core/composables/use-theme-cursor'
import ThemeFallingOverlay from './theme-falling-overlay.vue'

const { themeEntities } = storeToRefs(useSiteSettingsStore())

const show = ref(false)

const flakeCount = useResponsiveCount(
  [
    [480, 12],
    [768, 25]
  ],
  40
)

const { particles: flakes } = useFallingParticles(flakeCount, [8, 46])

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})

useThemeCursor(
  computed(() => themeEntities.value.cursor),
  'theme-cursor-new-year'
)
</script>

<template>
  <theme-falling-overlay
    :show="show"
    :show-background="themeEntities.background"
    :show-particles="themeEntities.particles"
    :particles="flakes"
    :bg-light="['rgba(59, 163, 232, 0.14)', 'rgba(59, 163, 232, 0.14)', 'rgba(124, 143, 242, 0.1)']"
    :bg-dark="['rgba(59, 163, 232, 0.2)', 'rgba(59, 163, 232, 0.2)', 'rgba(124, 143, 242, 0.14)']"
  >
    <template #default="{ particle: f }">
      <img
        :src="snowflake"
        class="animate-sway pointer-events-none block origin-center will-change-[transform,opacity] select-none"
        :style="{
          width: f.sizePx + 'px',
          opacity: f.opacity,
          filter: f.blurPx ? `blur(${f.blurPx}px)` : undefined,
          '--spin': f.spinDeg + 'deg'
        }"
        loading="lazy"
        alt=""
      />
    </template>
  </theme-falling-overlay>
</template>

<style>
html.theme-cursor-new-year,
html.theme-cursor-new-year body,
html.theme-cursor-new-year *:not(input):not(textarea):not([contenteditable]) {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='white' fill-opacity='0.4'/%3E%3Cg stroke='%233ba3e8' stroke-width='1.6' stroke-linecap='round'%3E%3Cline x1='12' y1='3' x2='12' y2='21'/%3E%3Cline x1='3' y1='12' x2='21' y2='12'/%3E%3Cline x1='5.5' y1='5.5' x2='18.5' y2='18.5'/%3E%3Cline x1='18.5' y1='5.5' x2='5.5' y2='18.5'/%3E%3C/g%3E%3C/svg%3E")
      16 16,
    auto;
}
</style>

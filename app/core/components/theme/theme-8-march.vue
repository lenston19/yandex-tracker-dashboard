<script setup lang="ts">
import flower from '~/assets/theme/8-march/flower.gif'
import whiteCat from '~/assets/theme/8-march/white-cat.gif'
import sleepyRabbit from '~/assets/theme/8-march/sleepy-rabbit.gif'
import { useSiteSettingsStore } from '~/modules/settings'
import { useFallingParticles } from '~/core/composables/use-falling-particles'
import { useResponsiveCount } from '~/core/composables/use-responsive-count'
import { useThemeCursor } from '~/core/composables/use-theme-cursor'
import ThemeFallingOverlay from './theme-falling-overlay.vue'

const { themeEntities } = storeToRefs(useSiteSettingsStore())

const show = ref(false)

const petalCount = useResponsiveCount(
  [
    [480, 5],
    [768, 8]
  ],
  12
)

const { particles } = useFallingParticles(petalCount, [16, 32])

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})

useThemeCursor(
  computed(() => themeEntities.value.cursor),
  'theme-cursor-8-march'
)
</script>

<template>
  <theme-falling-overlay
    :show="show"
    :show-background="themeEntities.background"
    :show-particles="themeEntities.particles"
    :particles="particles"
    :bg-light="['rgba(74, 222, 128, 0.12)', 'rgba(167, 139, 250, 0.12)', 'rgba(125, 211, 252, 0.10)']"
    :bg-dark="['rgba(74, 222, 128, 0.18)', 'rgba(167, 139, 250, 0.18)', 'rgba(125, 211, 252, 0.14)']"
  >
    <template #default="{ particle: f }">
      <img
        :src="flower"
        alt=""
        loading="lazy"
        class="animate-sway pointer-events-none block will-change-[transform,opacity] select-none"
        :style="{
          width: f.sizePx + 'px',
          opacity: f.opacity,
          filter: f.blurPx ? `blur(${f.blurPx}px)` : undefined,
          '--spin': f.spinDeg + 'deg'
        }"
      />
    </template>

    <template #companions>
      <img
        v-if="themeEntities.particles"
        :src="whiteCat"
        alt=""
        loading="lazy"
        class="theme-companion-sway absolute right-4 bottom-4 w-10 opacity-95 lg:w-20"
      />
      <img
        v-if="themeEntities.particles"
        :src="sleepyRabbit"
        alt=""
        loading="lazy"
        class="absolute bottom-36 left-24 hidden w-18 opacity-95 lg:block"
      />
    </template>
  </theme-falling-overlay>
</template>

<style>
html.theme-cursor-8-march,
html.theme-cursor-8-march body,
html.theme-cursor-8-march *:not(input):not(textarea):not([contenteditable]) {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 10 10' shape-rendering='crispEdges'%3E%3Crect x='4' y='0' width='1' height='1' fill='%23831843'/%3E%3Crect x='3' y='1' width='1' height='1' fill='%23831843'/%3E%3Crect x='4' y='1' width='1' height='1' fill='%23f472b6'/%3E%3Crect x='5' y='1' width='1' height='1' fill='%23831843'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23831843'/%3E%3Crect x='3' y='2' width='3' height='1' fill='%23f472b6'/%3E%3Crect x='6' y='2' width='1' height='1' fill='%23831843'/%3E%3Crect x='2' y='3' width='1' height='1' fill='%23831843'/%3E%3Crect x='3' y='3' width='3' height='1' fill='%23f472b6'/%3E%3Crect x='6' y='3' width='1' height='1' fill='%23831843'/%3E%3Crect x='3' y='4' width='1' height='1' fill='%23831843'/%3E%3Crect x='4' y='4' width='1' height='1' fill='%23f472b6'/%3E%3Crect x='5' y='4' width='1' height='1' fill='%23831843'/%3E%3Crect x='4' y='5' width='1' height='4' fill='%2316a34a'/%3E%3C/svg%3E")
      13 0,
    auto;
}
</style>

<style scoped>
@keyframes companion-sway {
  0%,
  100% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(4deg);
  }
}

.theme-companion-sway {
  transform-origin: bottom center;
  animation: companion-sway 4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .theme-companion-sway {
    animation: none !important;
  }
}
</style>

<script setup lang="ts">
import pacmanBlue from '~/assets/theme/programmer-day/pacman-blue.gif'
import pc from '~/assets/theme/programmer-day/pc.gif'
import { useSiteSettingsStore } from '~/modules/settings'
import { useFallingParticles } from '~/core/composables/use-falling-particles'
import { useResponsiveCount } from '~/core/composables/use-responsive-count'
import { useThemeCursor } from '~/core/composables/use-theme-cursor'
import ThemeFallingOverlay from './theme-falling-overlay.vue'

const { themeEntities } = storeToRefs(useSiteSettingsStore())

const CODE_CHARS = '01{}<>/;='.split('')

const show = ref(false)

const charCount = useResponsiveCount(
  [
    [480, 6],
    [768, 8]
  ],
  12
)

const { particles: chars } = useFallingParticles(charCount, [14, 22])

function charFor(id: number) {
  return CODE_CHARS[id % CODE_CHARS.length]
}

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})

useThemeCursor(
  computed(() => themeEntities.value.cursor),
  'theme-cursor-programmer-day'
)
</script>

<template>
  <theme-falling-overlay
    :show="show"
    :show-background="themeEntities.background"
    :show-particles="themeEntities.particles"
    :particles="chars"
    :bg-light="['rgba(74, 222, 128, 0.1)', 'rgba(34, 197, 94, 0.08)', 'rgba(74, 222, 128, 0.06)']"
    :bg-dark="['rgba(74, 222, 128, 0.16)', 'rgba(34, 197, 94, 0.14)', 'rgba(74, 222, 128, 0.1)']"
  >
    <template #default="{ particle: f }">
      <span
        class="animate-sway pointer-events-none block font-mono font-bold text-green-400 will-change-[transform,opacity] select-none"
        :style="{
          fontSize: f.sizePx + 'px',
          opacity: f.opacity,
          filter: f.blurPx ? `blur(${f.blurPx}px)` : undefined,
          '--spin': f.spinDeg + 'deg'
        }"
        >{{ charFor(f.id) }}</span
      >
    </template>

    <template #companions>
      <img
        v-if="themeEntities.particles"
        :src="pc"
        alt=""
        loading="lazy"
        class="theme-companion-sway absolute right-2 bottom-0 w-10 opacity-95 lg:w-20"
      />
      <img
        v-if="themeEntities.particles"
        :src="pacmanBlue"
        alt=""
        loading="lazy"
        class="theme-pacman-patrol absolute bottom-0 w-8 opacity-95 lg:w-14"
      />
    </template>
  </theme-falling-overlay>
</template>

<style>
html.theme-cursor-programmer-day,
html.theme-cursor-programmer-day body,
html.theme-cursor-programmer-day *:not(input):not(textarea):not([contenteditable]) {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ctext x='1' y='24' font-family='monospace' font-size='26' font-weight='bold' fill='%2322c55e'%3E%7B%7D%3C/text%3E%3C/svg%3E")
      4 16,
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

@keyframes pacman-patrol {
  0%,
  100% {
    left: 8%;
    transform: scaleX(1);
  }
  49% {
    transform: scaleX(1);
  }
  50% {
    left: 70%;
    transform: scaleX(-1);
  }
  99% {
    transform: scaleX(-1);
  }
}

.theme-pacman-patrol {
  animation: pacman-patrol 9s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .theme-companion-sway,
  .theme-pacman-patrol {
    animation: none !important;
  }
}
</style>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import snowflake from '~/assets/theme/new-year/snowflake.gif'
import { useSiteSettingsStore } from '~/modules/settings'

const { themeEntities } = storeToRefs(useSiteSettingsStore())

interface Flake {
  id: number
  leftPct: number
  sizePx: number
  durationSec: number
  delaySec: number
  swayPx: number
  spinDeg: number
  opacity: number
  blurPx: number
}

const show = ref(false)
const flakes = ref<Flake[]>([])

const { width } = useWindowSize()

const flakeCount = computed(() => {
  if (width.value < 480) return 12
  if (width.value < 768) return 25
  return 40
})

const MIN_SIZE = 8
const MAX_SIZE = 46
const MIN_DURATION = 8
const MAX_DURATION = 20
const MIN_SWAY = 10
const MAX_SWAY = 60

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function buildFlakes(count: number) {
  const out: Flake[] = []
  for (let i = 0; i < count; i++) {
    const duration = Number(rand(MIN_DURATION, MAX_DURATION).toFixed(2))
    const delay = Number((-Math.random() * duration).toFixed(2))
    const sizePx = Number(rand(MIN_SIZE, MAX_SIZE).toFixed(1))
    out.push({
      id: i,
      leftPct: Number(rand(0, 100).toFixed(2)),
      sizePx,
      durationSec: duration,
      delaySec: delay,
      swayPx: Number(rand(MIN_SWAY, MAX_SWAY).toFixed(1)) * (Math.random() > 0.5 ? 1 : -1),
      spinDeg: Number(rand(-360, 360).toFixed(1)),
      opacity: Number(rand(0.5, 1).toFixed(2)),
      blurPx: Number((((MAX_SIZE - sizePx) / MAX_SIZE) * 1.5).toFixed(2))
    })
  }
  return out
}

watch(
  flakeCount,
  () => {
    flakes.value = buildFlakes(flakeCount.value)
  },
  { immediate: true }
)

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})

watch(
  () => themeEntities.value.cursor,
  enabled => document.documentElement.classList.toggle('theme-cursor-new-year', enabled),
  { immediate: true }
)

onUnmounted(() => {
  document.documentElement.classList.remove('theme-cursor-new-year')
})
</script>

<template>
  <div
    v-if="show"
    class="animate-appear pointer-events-none fixed inset-0 z-9999 overflow-hidden opacity-0 select-none"
    aria-hidden="true"
  >
    <div
      v-if="themeEntities.background"
      class="theme-bg-accent-new-year absolute inset-0"
    />

    <template v-if="themeEntities.particles">
      <div
        v-for="f in flakes"
        :key="f.id"
        class="animate-fall absolute will-change-transform"
        :style="{
          left: f.leftPct + '%',
          top: '-12vh',
          '--duration': f.durationSec + 's',
          '--delay': f.delaySec + 's',
          '--sway': f.swayPx + 'px'
        }"
      >
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
      </div>
    </template>
  </div>
</template>

<style>
/* ponytail: глобальный курсор, т.к. должен каскадироваться на всё приложение, а не только на дерево оверлея */
html.theme-cursor-new-year,
html.theme-cursor-new-year body,
html.theme-cursor-new-year *:not(input):not(textarea):not([contenteditable]) {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='10' fill='white' fill-opacity='0.4'/%3E%3Cg stroke='%233ba3e8' stroke-width='1.6' stroke-linecap='round'%3E%3Cline x1='12' y1='3' x2='12' y2='21'/%3E%3Cline x1='3' y1='12' x2='21' y2='12'/%3E%3Cline x1='5.5' y1='5.5' x2='18.5' y2='18.5'/%3E%3Cline x1='18.5' y1='5.5' x2='5.5' y2='18.5'/%3E%3C/g%3E%3C/svg%3E")
      12 12,
    auto;
}
</style>

<style scoped>
.theme-bg-accent-new-year {
  background-image:
    radial-gradient(ellipse 60% 40% at 0% 0%, rgba(59, 163, 232, 0.14), transparent 70%),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59, 163, 232, 0.14), transparent 70%),
    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(124, 143, 242, 0.1), transparent 70%);
}

html.dark .theme-bg-accent-new-year {
  background-image:
    radial-gradient(ellipse 60% 40% at 0% 0%, rgba(59, 163, 232, 0.2), transparent 70%),
    radial-gradient(ellipse 60% 40% at 100% 0%, rgba(59, 163, 232, 0.2), transparent 70%),
    radial-gradient(ellipse 70% 50% at 50% 100%, rgba(124, 143, 242, 0.14), transparent 70%);
}

@keyframes fall {
  0% {
    transform: translateY(-12vh);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh);
    opacity: 0.9;
  }
}

@keyframes sway {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(var(--sway)) rotate(var(--spin));
  }
}

@keyframes appear {
  to {
    opacity: 1;
  }
}

.animate-fall {
  animation: fall var(--duration) linear infinite;
  animation-delay: var(--delay);
}

.animate-sway {
  animation: sway calc(var(--duration) * 0.25) ease-in-out infinite alternate;
  animation-delay: var(--delay);
}

.animate-appear {
  animation: appear 0.6s ease forwards;
  animation-delay: 0.1s;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fall,
  .animate-sway,
  .animate-appear {
    animation: none !important;
  }

  .animate-appear {
    opacity: 1;
  }

  .animate-fall {
    display: none;
  }
}
</style>

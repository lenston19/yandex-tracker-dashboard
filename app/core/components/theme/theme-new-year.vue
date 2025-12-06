<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import snowflake from '~/assets/theme/new-year/snowflake.gif'

interface Flake {
  id: number
  leftPct: number
  sizePx: number
  durationSec: number
  delaySec: number
  swayPx: number
  spinDeg: number
  opacity: number
}

const show = ref(false)
const flakes = ref<Flake[]>([])

const { width } = useWindowSize()

const flakeCount = computed(() => {
  if (width.value < 480) return 12
  if (width.value < 768) return 25
  return 40
})

const MIN_SIZE = 10
const MAX_SIZE = 40
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
    out.push({
      id: i,
      leftPct: Number(rand(0, 100).toFixed(2)),
      sizePx: Number(rand(MIN_SIZE, MAX_SIZE).toFixed(1)),
      durationSec: duration,
      delaySec: delay,
      swayPx: Number(rand(MIN_SWAY, MAX_SWAY).toFixed(1)) * (Math.random() > 0.5 ? 1 : -1),
      spinDeg: Number(rand(-360, 360).toFixed(1)),
      opacity: Number(rand(0.6, 1).toFixed(2))
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
</script>

<template>
  <div
    v-if="show"
    class="animate-appear pointer-events-none fixed inset-0 z-[9999] overflow-hidden opacity-0 select-none"
    aria-hidden="true"
  >
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
          '--spin': f.spinDeg + 'deg'
        }"
        loading="lazy"
        alt=""
      />
    </div>
  </div>
</template>

<style scoped>
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
}
</style>

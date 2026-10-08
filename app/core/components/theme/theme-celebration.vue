<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    trigger: boolean
    glyph?: string
    count?: number
  }>(),
  { glyph: '✨', count: 14 }
)

interface Particle {
  id: number
  leftPct: number
  driftPx: number
  spinDeg: number
  sizePx: number
  durationSec: number
  delaySec: number
}

const particles = ref<Particle[]>([])
let nextId = 0

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function burst() {
  particles.value = Array.from({ length: props.count }, () => ({
    id: nextId++,
    leftPct: rand(5, 95),
    driftPx: rand(-40, 40),
    spinDeg: rand(-180, 180),
    sizePx: rand(14, 26),
    durationSec: Number(rand(0.9, 1.6).toFixed(2)),
    delaySec: Number(rand(0, 0.25).toFixed(2))
  }))

  setTimeout(() => {
    particles.value = []
  }, 2000)
}

watch(
  () => props.trigger,
  (isDone, wasDone) => {
    if (isDone && !wasDone) burst()
  }
)
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 overflow-visible select-none"
    aria-hidden="true"
  >
    <span
      v-for="p in particles"
      :key="p.id"
      class="theme-celebration-particle absolute bottom-0"
      :style="{
        left: p.leftPct + '%',
        fontSize: p.sizePx + 'px',
        '--drift': p.driftPx + 'px',
        '--spin': p.spinDeg + 'deg',
        animationDuration: p.durationSec + 's',
        animationDelay: p.delaySec + 's'
      }"
    >
      {{ glyph }}
    </span>
  </div>
</template>

<style scoped>
.theme-celebration-particle {
  animation-name: celebration-rise;
  animation-timing-function: ease-out;
  animation-fill-mode: forwards;
  will-change: transform, opacity;
}

@keyframes celebration-rise {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: translate(var(--drift), -90px) rotate(var(--spin));
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .theme-celebration-particle {
    animation: none !important;
    display: none;
  }
}
</style>

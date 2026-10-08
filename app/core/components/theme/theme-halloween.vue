<script setup lang="ts">
import bat from '~/assets/theme/halloween/bat.gif'
import ghost from '~/assets/theme/halloween/ghost.gif'
import pumpkin from '~/assets/theme/halloween/pumpkin.gif'
import { useSiteSettingsStore } from '~/modules/settings'
import { useResponsiveCount } from '~/core/composables/use-responsive-count'
import { useThemeCursor } from '~/core/composables/use-theme-cursor'
import ThemeBgAccent from './theme-bg-accent.vue'

const { themeEntities } = storeToRefs(useSiteSettingsStore())

interface Flyer {
  id: number
  topPct: number
  sizePx: number
  durationSec: number
  delaySec: number
  flipped: boolean
}

interface Ghost {
  id: number
  leftPct: number
  bottomPct: number
  sizePx: number
  durationSec: number
  delaySec: number
}

const show = ref(false)
const bats = ref<Flyer[]>([])
const ghosts = ref<Ghost[]>([])

const batCount = useResponsiveCount(
  [
    [480, 1],
    [768, 2]
  ],
  4
)

const ghostCount = useResponsiveCount([[480, 1]], 2)

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function buildBats(count: number): Flyer[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    topPct: Number(rand(2, 35).toFixed(1)),
    sizePx: Number(rand(28, 48).toFixed(0)),
    durationSec: Number(rand(11, 22).toFixed(2)),
    delaySec: Number((-Math.random() * 20).toFixed(2)),
    flipped: i % 2 === 0
  }))
}

function buildGhosts(count: number): Ghost[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    leftPct: Number(rand(2, 70).toFixed(1)),
    bottomPct: Number(rand(8, 25).toFixed(1)),
    sizePx: Number(rand(45, 90).toFixed(0)),
    durationSec: Number(rand(14, 24).toFixed(2)),
    delaySec: Number((-Math.random() * 20).toFixed(2))
  }))
}

watch(batCount, () => (bats.value = buildBats(batCount.value)), { immediate: true })
watch(ghostCount, () => (ghosts.value = buildGhosts(ghostCount.value)), { immediate: true })

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})

useThemeCursor(
  computed(() => themeEntities.value.cursor),
  'theme-cursor-halloween'
)
</script>

<template>
  <div
    v-if="show"
    class="theme-appear pointer-events-none fixed inset-0 z-9999 overflow-hidden opacity-0 select-none"
    aria-hidden="true"
  >
    <template v-if="themeEntities.background">
      <theme-bg-accent
        :light="['rgba(140, 70, 190, 0.14)', 'rgba(255, 140, 26, 0.12)', 'rgba(74, 20, 90, 0.16)']"
        :dark="['rgba(140, 70, 190, 0.22)', 'rgba(255, 140, 26, 0.16)', 'rgba(74, 20, 90, 0.26)']"
      />
      <div class="theme-cobweb theme-cobweb--tl absolute top-0 left-0" />
      <div class="theme-cobweb theme-cobweb--tr absolute top-0 right-0" />
      <div class="theme-fog absolute inset-x-0 bottom-0" />
    </template>

    <template v-if="themeEntities.particles">
      <img
        v-for="b in bats"
        :key="`bat-${b.id}`"
        :src="bat"
        alt=""
        loading="lazy"
        class="theme-fly-left absolute opacity-90"
        :class="{ 'theme-fly-right': b.flipped }"
        :style="{
          top: b.topPct + '%',
          width: b.sizePx + 'px',
          '--duration': b.durationSec + 's',
          '--delay': b.delaySec + 's'
        }"
      />

      <img
        v-for="g in ghosts"
        :key="`ghost-${g.id}`"
        :src="ghost"
        alt=""
        loading="lazy"
        class="theme-float-ghost absolute opacity-90"
        :style="{
          left: g.leftPct + '%',
          bottom: g.bottomPct + '%',
          width: g.sizePx + 'px',
          '--duration': g.durationSec + 's',
          '--delay': g.delaySec + 's'
        }"
      />

      <div class="absolute right-0 bottom-0 flex items-end pr-4 pb-3">
        <img
          :src="pumpkin"
          alt="pumpkin big"
          class="w-11.25 opacity-95 drop-shadow-lg transition-transform duration-700 lg:w-22.5"
          loading="lazy"
        />
        <img
          :src="pumpkin"
          alt="pumpkin medium"
          class="absolute w-7.5 -translate-x-1/2 opacity-90 drop-shadow-md transition-transform duration-700 lg:w-15"
          loading="lazy"
        />
        <img
          :src="pumpkin"
          alt="pumpkin small"
          class="absolute w-5 translate-x-[calc(100%+10px)] opacity-80 drop-shadow-sm transition-transform duration-700 lg:w-10"
          loading="lazy"
        />
      </div>
    </template>
  </div>
</template>

<style>
html.theme-cursor-halloween,
html.theme-cursor-halloween body,
html.theme-cursor-halloween *:not(input):not(textarea):not([contenteditable]) {
  cursor:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='13' r='9' fill='%23ff8c1a'/%3E%3Crect x='11' y='2' width='2' height='4' rx='1' fill='%234a7a3c'/%3E%3Cpath d='M8 11 L10.5 14.5 L7.5 14.5 Z' fill='%232a1a05'/%3E%3Cpath d='M16 11 L13.5 14.5 L16.5 14.5 Z' fill='%232a1a05'/%3E%3Cpath d='M8 17.5 Q12 20.5 16 17.5' stroke='%232a1a05' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")
      16 16,
    auto;
}
</style>

<style scoped>
.theme-cobweb {
  width: 130px;
  height: 130px;
  opacity: 0.4;
  background-repeat: no-repeat;
}

.theme-cobweb--tl {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 130 130'%3E%3Cg fill='none' stroke='%23e4d9f0' stroke-width='1'%3E%3Cpath d='M0 0 L130 0 M0 0 L0 130 M0 0 L65 65 M0 0 L95 24 M0 0 L24 95'/%3E%3Cpath d='M10 10 Q24 3 38 10 M19 19 Q38 7 57 19 M28 28 Q54 12 76 28 M37 37 Q70 16 94 37'/%3E%3C/g%3E%3C/svg%3E");
}

.theme-cobweb--tr {
  transform: scaleX(-1);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='130' viewBox='0 0 130 130'%3E%3Cg fill='none' stroke='%23e4d9f0' stroke-width='1'%3E%3Cpath d='M0 0 L130 0 M0 0 L0 130 M0 0 L65 65 M0 0 L95 24 M0 0 L24 95'/%3E%3Cpath d='M10 10 Q24 3 38 10 M19 19 Q38 7 57 19 M28 28 Q54 12 76 28 M37 37 Q70 16 94 37'/%3E%3C/g%3E%3C/svg%3E");
}

.theme-fog {
  height: 26vh;
  opacity: 0.6;
  filter: blur(28px);
  background-image: repeating-linear-gradient(
    100deg,
    rgba(180, 160, 220, 0.2) 0px,
    rgba(180, 160, 220, 0.2) 100px,
    transparent 180px,
    transparent 320px
  );
  background-size: 200% 100%;
  animation: fog-drift 40s linear infinite;
}

@keyframes fog-drift {
  from {
    background-position-x: 0;
  }
  to {
    background-position-x: -100%;
  }
}

@keyframes theme-appear {
  to {
    opacity: 1;
  }
}

.theme-appear {
  animation: theme-appear 0.6s ease forwards;
  animation-delay: 0.1s;
}

@keyframes fly-left {
  0% {
    transform: translateX(-20vw) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateX(60vw) translateY(10px);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(120vw) translateY(-10px);
    opacity: 0;
  }
}

@keyframes fly-right {
  0% {
    transform: translateX(120vw) scaleX(-1) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateX(40vw) scaleX(-1) translateY(-10px);
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(-20vw) scaleX(-1) translateY(10px);
    opacity: 0;
  }
}

.theme-fly-left {
  animation: fly-left var(--duration) linear infinite;
  animation-delay: var(--delay);
}

.theme-fly-right {
  animation-name: fly-right;
}

@keyframes float-ghost-diagonal {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  25% {
    transform: translate(25vw, -15vh) scale(1.05);
    opacity: 1;
  }
  50% {
    transform: translate(55vw, -25vh) scale(1.1);
    opacity: 0.9;
  }
  75% {
    transform: translate(25vw, -10vh) scale(1.03);
    opacity: 1;
  }
  100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
}

.theme-float-ghost {
  animation: float-ghost-diagonal var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
}

@media (prefers-reduced-motion: reduce) {
  .theme-appear {
    animation: none !important;
    opacity: 1;
  }

  .theme-fly-left,
  .theme-float-ghost {
    display: none;
  }

  .theme-fog {
    animation: none !important;
  }
}
</style>

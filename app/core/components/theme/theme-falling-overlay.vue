<script setup lang="ts">
import type { FallingParticle } from '~/core/composables/use-falling-particles'
import ThemeBgAccent from './theme-bg-accent.vue'

defineProps<{
  show: boolean
  showBackground: boolean
  showParticles: boolean
  particles: FallingParticle[]
  bgLight: [string, string, string]
  bgDark: [string, string, string]
}>()
</script>

<template>
  <div
    v-if="show"
    class="animate-appear pointer-events-none fixed inset-0 z-9999 overflow-hidden opacity-0 select-none"
    aria-hidden="true"
  >
    <theme-bg-accent
      v-if="showBackground"
      :light="bgLight"
      :dark="bgDark"
    />

    <template v-if="showParticles">
      <div
        v-for="f in particles"
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
        <slot :particle="f" />
      </div>
    </template>

    <slot name="companions" />
  </div>
</template>

<style>
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

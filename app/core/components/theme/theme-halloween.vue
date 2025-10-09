<script setup lang="ts">
import { ref, onMounted } from 'vue'
import bat from '~/assets/theme/halloween/bat.gif'
import ghost from '~/assets/theme/halloween/ghost.gif'
import pumpkin from '~/assets/theme/halloween/pumpkin.gif'

const show = ref(false)

onMounted(() => {
  setTimeout(() => (show.value = true), 300)
})
</script>

<template>
  <div
    v-if="show"
    class="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
  >
    <img
      :src="bat"
      alt="bat"
      class="absolute top-2 left-[-10%] w-10 animate-[flyAcrossLeft_18s_linear_infinite] opacity-90"
      loading="lazy"
    />
    <img
      :src="bat"
      alt="bat"
      class="absolute top-2 right-[-10%] w-10 -scale-x-100 animate-[flyAcrossRight_13s_linear_infinite] opacity-90"
      loading="lazy"
    />

    <img
      :src="ghost"
      alt="ghost"
      class="absolute bottom-[15%] left-[5%] w-[45px] animate-[floatGhostDiagonal_18s_ease-in-out_infinite] opacity-90 lg:w-[90px]"
      loading="lazy"
    />

    <div class="absolute right-0 bottom-0 flex items-end pr-4 pb-3">
      <img
        :src="pumpkin"
        alt="pumpkin big"
        class="w-[45px] opacity-95 drop-shadow-lg transition-transform duration-700 lg:w-[90px]"
        loading="lazy"
      />
      <img
        :src="pumpkin"
        alt="pumpkin medium"
        class="absolute w-[30px] -translate-x-1/2 opacity-90 drop-shadow-md transition-transform duration-700 lg:w-[60px]"
        loading="lazy"
      />
      <img
        :src="pumpkin"
        alt="pumpkin small"
        class="absolute w-[20px] translate-x-[calc(100%+10px)] opacity-80 drop-shadow-sm transition-transform duration-700 lg:w-[40px]"
        loading="lazy"
      />
    </div>
  </div>
</template>

<style>
@keyframes flyAcrossLeft {
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
@keyframes flyAcrossRight {
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

@keyframes floatGhostDiagonal {
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
</style>

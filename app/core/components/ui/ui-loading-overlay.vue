<script setup lang="ts">
const modelValue = defineModel<boolean>({ default: false })
</script>

<template>
  <transition
    enter-active-class="ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[9999] bg-gray-200 transition-opacity dark:bg-neutral-900"
    ></div>
  </transition>
  <div
    v-if="modelValue"
    class="fixed top-1/2 left-1/2 z-[9999] -translate-x-1/2"
  >
    <div class="container">
      <div class="dot"></div>
      <div class="traveler"></div>
    </div>
    <svg
      width="0"
      height="0"
      class="svg"
    >
      <defs>
        <filter id="uib-jelly-triangle-ooze">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="3.333"
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="ooze"
          />
          <feBlend
            in="SourceGraphic"
            in2="ooze"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped>
.container {
  --uib-size: 60px;
  --uib-color: rgba(0 220 130);
  --uib-speed: 1.75s;
  position: relative;
  height: var(--uib-size);
  width: var(--uib-size);
  filter: url('#uib-jelly-triangle-ooze');
}

.container::before,
.container::after,
.dot {
  content: '';
  position: absolute;
  width: 33%;
  height: 33%;
  background-color: var(--uib-color);
  border-radius: 100%;
  will-change: transform;
  transition: background-color 0.3s ease;
}

.dot {
  top: 6%;
  left: 30%;
  animation: grow var(--uib-speed) ease infinite;
}

.container::before {
  bottom: 6%;
  right: 0;
  animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.666) infinite;
}

.container::after {
  bottom: 6%;
  left: 0;
  animation: grow var(--uib-speed) ease calc(var(--uib-speed) * -0.333) infinite;
}

.traveler {
  position: absolute;
  top: 6%;
  left: 30%;
  width: 33%;
  height: 33%;
  background-color: var(--uib-color);
  border-radius: 100%;
  animation: triangulate var(--uib-speed) ease infinite;
  transition: background-color 0.3s ease;
}

.svg {
  width: 0;
  height: 0;
  position: absolute;
}

@keyframes triangulate {
  0%,
  100% {
    transform: none;
  }

  33.333% {
    transform: translate(120%, 175%);
  }

  66.666% {
    transform: translate(-95%, 175%);
  }
}

@keyframes grow {
  0%,
  85%,
  100% {
    transform: scale(1.5);
  }

  50%,
  60% {
    transform: scale(0);
  }
}
</style>

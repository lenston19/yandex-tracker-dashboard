import type { ComputedRef, Ref } from 'vue'

export interface FallingParticle {
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

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function useFallingParticles(count: Ref<number> | ComputedRef<number>, sizeRange: [number, number] = [8, 46]) {
  const [minSize, maxSize] = sizeRange
  const particles = ref<FallingParticle[]>([])

  function build(value: number): FallingParticle[] {
    return Array.from({ length: value }, (_, id) => {
      const durationSec = Number(rand(8, 20).toFixed(2))
      const sizePx = Number(rand(minSize, maxSize).toFixed(1))
      return {
        id,
        leftPct: Number(rand(0, 100).toFixed(2)),
        sizePx,
        durationSec,
        delaySec: Number((-Math.random() * durationSec).toFixed(2)),
        swayPx: Number(rand(10, 60).toFixed(1)) * (Math.random() > 0.5 ? 1 : -1),
        spinDeg: Number(rand(-360, 360).toFixed(1)),
        opacity: Number(rand(0.5, 1).toFixed(2)),
        blurPx: Number((((maxSize - sizePx) / maxSize) * 1.5).toFixed(2))
      }
    })
  }

  watch(count, value => (particles.value = build(value)), { immediate: true })

  return { particles }
}

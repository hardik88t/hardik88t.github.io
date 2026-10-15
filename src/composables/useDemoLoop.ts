import { computed, ref, watch } from 'vue'
import { useElementVisibility, useIntervalFn, type MaybeElementRef } from '@vueuse/core'
import { reducedMotion } from './usePress'

/**
 * Drives a looping mini-demo. The loop only runs while the element is on screen,
 * the pointer is not over it, the user has not paused it, and reduced motion is off.
 */
export function useDemoLoop(target: MaybeElementRef, tick: () => void, interval: number) {
  const visible = useElementVisibility(target)
  const hovered = ref(false)
  const userPaused = ref(false)
  const running = computed(
    () => visible.value && !hovered.value && !userPaused.value && !reducedMotion.value,
  )
  const loop = useIntervalFn(tick, interval, { immediate: false })
  watch(
    running,
    (on) => {
      if (on) loop.resume()
      else loop.pause()
    },
    { immediate: true },
  )
  return { hovered, userPaused, running, visible }
}

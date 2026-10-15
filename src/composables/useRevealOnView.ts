import { onScopeDispose, ref, watch } from 'vue'
import { useElementVisibility, type MaybeElementRef } from '@vueuse/core'
import { reducedMotion } from './usePress'

/**
 * Content is rendered in its final state. The first time the element scrolls into view,
 * `progress` runs 0 -> 1 once (charts draw, numbers count up). Reduced motion skips the tween.
 */
export function useRevealOnView(target: MaybeElementRef, duration = 1200) {
  const visible = useElementVisibility(target)
  const progress = ref(1)
  let played = false
  let raf = 0
  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  watch(visible, (on) => {
    if (!on || played || reducedMotion.value) return
    played = true
    progress.value = 0
    const start = performance.now()
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      progress.value = ease(p)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  })

  onScopeDispose(() => cancelAnimationFrame(raf))
  return { progress, visible }
}

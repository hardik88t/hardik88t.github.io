import { computed } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

// Shared reduced-motion preference. Heavy motion is disabled when the OS asks for it.
const pref = usePreferredReducedMotion()
export const reducedMotion = computed(() => pref.value === 'reduce')

/** Spring press/hover props for @vueuse/motion's v-motion directive (undefined when reduced). */
export const pressHover = computed(() => (reducedMotion.value ? undefined : { scale: 1.02 }))
export const pressTap = computed(() => (reducedMotion.value ? undefined : { scale: 0.96 }))

<script setup lang="ts">
import { computed, ref } from 'vue'
import { contrast, hexLuminance, INK_HEX, WHITE_HEX } from '@/lib/color'
import BentoTile from './BentoTile.vue'

// Simulations are approximations for design review, not a substitute for testing with real users.
const large = ref(false)
const greyscale = ref(false)
const lowVision = ref(false)

const toggles = computed(() => [
  { id: 'large', label: 'Large text', on: large, hint: 'Scales the sample type to 1.3x' },
  { id: 'grey', label: 'Greyscale', on: greyscale, hint: 'Removes hue, keeps contrast' },
  { id: 'low', label: 'Low vision (approx.)', on: lowVision, hint: 'Blur and reduced contrast' },
])

const inkOnWhite = contrast(hexLuminance(INK_HEX), hexLuminance(WHITE_HEX))
const mutedOnWhite = contrast(hexLuminance('#5c6b63'), hexLuminance(WHITE_HEX))

const sampleClass = computed(() => [
  large.value ? 'text-[1.3em]' : '',
  greyscale.value ? 'grayscale' : '',
  lowVision.value ? 'a11y-blur' : '',
])

const readout = computed(() => (large.value ? 'Larger text, same contrast' : 'Default sizes'))
</script>

<template>
  <BentoTile id="a11y" eyebrow="Accessibility / built in" title="See it the way a reader might">
    <div class="flex flex-1 flex-col gap-4">
      <div class="grid gap-2" role="group" aria-label="Simulation toggles">
        <button
          v-for="t in toggles"
          :key="t.id"
          type="button"
          role="switch"
          :aria-checked="t.on.value"
          class="flex min-h-11 w-full items-center justify-between gap-3 rounded-inner border border-line bg-surface-2 px-3 text-left"
          @click="t.on.value = !t.on.value"
        >
          <span class="min-w-0">
            <span class="block text-[0.85rem] font-medium">{{ t.label }}</span>
            <span class="block text-[0.72rem] text-muted">{{ t.hint }}</span>
          </span>
          <span class="switch" aria-hidden="true" :aria-checked="t.on.value" />
        </button>
      </div>

      <div
        class="sample-card rounded-inner border border-line bg-surface p-4 transition-[filter,font-size] duration-500 ease-out"
        :class="sampleClass"
        data-scheme="light"
      >
        <p class="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted">Order summary</p>
        <p class="mt-1 text-[1rem] font-semibold leading-snug text-ink">Session booked for Thursday</p>
        <p class="mt-1.5 text-[0.86rem] leading-relaxed text-muted">A reminder goes out the day before, with a link to reschedule.</p>
        <div class="mt-3 flex items-center gap-2">
          <span class="btn btn-primary min-h-9 px-3 text-[0.82rem]" style="border-radius: var(--radius-sm)">Confirm</span>
          <span class="btn btn-ghost min-h-9 px-3 text-[0.82rem]" style="border-radius: var(--radius-sm)">Change</span>
        </div>
      </div>

      <div class="mt-auto space-y-2 text-[0.8rem] leading-snug">
        <p class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="text-muted">Body text on white</span>
          <span class="mono-num font-semibold text-ink">{{ inkOnWhite.toFixed(1) }}:1</span>
          <span class="rounded-full bg-sage/15 px-2 py-0.5 text-[0.7rem] font-semibold text-sage-ink">AA pass</span>
        </p>
        <p class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span class="text-muted">Muted label on white</span>
          <span class="mono-num font-semibold text-ink">{{ mutedOnWhite.toFixed(1) }}:1</span>
          <span class="rounded-full bg-sage/15 px-2 py-0.5 text-[0.7rem] font-semibold text-sage-ink">AA pass</span>
        </p>
        <p class="text-muted" role="status" aria-live="polite">{{ readout }}.</p>
      </div>
    </div>
  </BentoTile>
</template>

<style scoped>
.a11y-blur {
  filter: blur(0.6px) contrast(0.78);
}
.sample-card.grayscale {
  filter: grayscale(1);
}
.sample-card.a11y-blur.grayscale {
  filter: grayscale(1) blur(0.6px) contrast(0.78);
}
</style>

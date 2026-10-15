<script setup lang="ts">
import { computed, ref } from 'vue'
import { accentForHue, formatRatio } from '@/lib/color'
import { pressHover, pressTap } from '@/composables/usePress'
import BentoTile from './BentoTile.vue'

// Site defaults. "Apply to site" writes the playground values onto :root; "Reset" removes them.
const DEFAULTS = { hue: 265, radius: 20, density: 'comfortable' as Density, scheme: 'light' as Scheme }
type Density = 'comfortable' | 'compact'
type Scheme = 'light' | 'dark'

const hue = ref(DEFAULTS.hue)
const radius = ref(DEFAULTS.radius)
const density = ref<Density>(DEFAULTS.density)
const scheme = ref<Scheme>(DEFAULTS.scheme)
const applied = ref(false)
const notice = ref('')

const token = computed(() => accentForHue(hue.value))
const pad = computed(() => (density.value === 'compact' ? 16 : 24))
const hueTrack = 'linear-gradient(90deg, oklch(56% 0.18 0), oklch(56% 0.18 60), oklch(56% 0.18 120), oklch(56% 0.18 180), oklch(56% 0.18 240), oklch(56% 0.18 300), oklch(56% 0.18 360))'

const sampleStyle = computed(() => ({
  '--accent': token.value.accent,
  '--on-accent': token.value.onAccent,
  '--radius': `${radius.value}px`,
  '--radius-sm': `${Math.max(0, Math.round(radius.value * 0.6))}px`,
  '--pad': `${pad.value}px`,
}))

function applyToSite() {
  const root = document.documentElement.style
  root.setProperty('--accent', token.value.accent)
  root.setProperty('--on-accent', token.value.onAccent)
  root.setProperty('--radius', `${radius.value}px`)
  root.setProperty('--radius-sm', `${Math.max(0, Math.round(radius.value * 0.6))}px`)
  root.setProperty('--pad', `${pad.value}px`)
  applied.value = true
  notice.value = 'Applied. Accent, radius and padding now change across this page.'
}

function reset() {
  hue.value = DEFAULTS.hue
  radius.value = DEFAULTS.radius
  density.value = DEFAULTS.density
  scheme.value = DEFAULTS.scheme
  const root = document.documentElement.style
  ;['--accent', '--on-accent', '--radius', '--radius-sm', '--pad'].forEach((p) => root.removeProperty(p))
  applied.value = false
  notice.value = 'Reset to the site defaults.'
}

const tokensText = computed(
  () =>
    `--accent: ${token.value.accent}\n--radius: ${radius.value}px\n--pad: ${pad.value}px\n--density: ${density.value}`,
)
</script>

<template>
  <BentoTile id="tokens" eyebrow="Design system / live tokens" title="Token playground">
    <div class="grid flex-1 gap-5">
      <div class="grid gap-4">
        <label class="block">
          <span class="flex items-center justify-between text-[0.85rem] font-medium">
            Hue <span class="mono-num text-muted">{{ hue }}°</span>
          </span>
          <input
            v-model.number="hue"
            type="range"
            min="0"
            max="360"
            step="1"
            class="mt-1"
            :style="{ '--range-track': hueTrack }"
          />
        </label>

        <label class="block">
          <span class="flex items-center justify-between text-[0.85rem] font-medium">
            Corner radius <span class="mono-num text-muted">{{ radius }}px</span>
          </span>
          <input v-model.number="radius" type="range" min="0" max="32" step="1" class="mt-1" style="--range-track: var(--line)" />
        </label>

        <div class="flex flex-wrap items-center gap-x-5 gap-y-3">
          <fieldset class="min-w-0">
            <legend class="mb-1.5 text-[0.85rem] font-medium">Density</legend>
            <div class="inline-flex rounded-inner border border-line bg-surface-2 p-0.5">
              <button
                v-for="opt in ['comfortable', 'compact'] as const"
                :key="opt"
                type="button"
                class="min-h-9 rounded-[calc(var(--radius-inner)*0.7)] px-3 text-[0.82rem] font-medium"
                :class="density === opt ? 'bg-surface text-ink shadow-[var(--shadow)] ring-1 ring-line' : 'text-muted'"
                :aria-pressed="density === opt"
                @click="density = opt"
              >
                {{ opt === 'comfortable' ? 'Comfortable' : 'Compact' }}
              </button>
            </div>
          </fieldset>
          <fieldset class="min-w-0">
            <legend class="mb-1.5 text-[0.85rem] font-medium">Sample theme</legend>
            <div class="inline-flex rounded-inner border border-line bg-surface-2 p-0.5">
              <button
                v-for="opt in ['light', 'dark'] as const"
                :key="opt"
                type="button"
                class="min-h-9 rounded-[calc(var(--radius-inner)*0.7)] px-3 text-[0.82rem] font-medium"
                :class="scheme === opt ? 'bg-surface text-ink shadow-[var(--shadow)] ring-1 ring-line' : 'text-muted'"
                :aria-pressed="scheme === opt"
                @click="scheme = opt"
              >
                {{ opt === 'light' ? 'Light' : 'Dark' }}
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <div
        :data-scheme="scheme"
        :style="sampleStyle"
        class="sample flex flex-col gap-3 border border-line bg-surface p-[var(--pad)] text-ink shadow-[var(--shadow)] transition-[padding,border-radius] duration-500 ease-out"
        style="border-radius: var(--radius)"
        aria-label="Sample UI card that reflects the token choices"
        role="group"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="text-[0.92rem] font-semibold">Project brief</p>
          <span class="chip px-2 py-0 text-[0.7rem]" style="border-radius: var(--radius-sm)">Draft</span>
        </div>
        <label class="block text-[0.8rem] text-muted">
          Project name
          <input
            type="text"
            value="Studio redesign"
            class="mt-1 block w-full min-h-10 border border-line bg-surface-2 px-3 text-[0.9rem] text-ink"
            style="border-radius: var(--radius-sm)"
          />
        </label>
        <div class="flex items-center justify-between gap-3">
          <span class="text-[0.86rem]">Send weekly updates</span>
          <span class="switch" aria-hidden="true" aria-checked="true" />
        </div>
        <div class="h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
          <div class="h-full w-[62%] rounded-full bg-[var(--accent)]" />
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <span
            class="btn btn-primary min-h-10 px-4 text-[0.88rem]"
            style="border-radius: var(--radius-sm); background: var(--accent); color: var(--on-accent)"
          >
            Save draft
          </span>
          <span class="btn btn-ghost min-h-10 px-4 text-[0.88rem]" style="border-radius: var(--radius-sm)">Cancel</span>
        </div>
      </div>

      <div class="grid gap-3">
        <p class="font-mono text-[0.72rem] leading-relaxed whitespace-pre text-muted">{{ tokensText }}</p>
        <p class="text-[0.82rem] leading-snug text-ink">
          Button text contrast
          <span class="mono-num font-semibold">{{ formatRatio(token.ratio) }}</span>
          <span
            class="ml-1 rounded-full px-2 py-0.5 text-[0.72rem] font-semibold"
            :class="token.pass ? 'bg-sage/15 text-sage-ink' : 'bg-marigold/25 text-marigold-ink'"
          >
            {{ token.pass ? 'AA pass' : 'Below AA' }}
          </span>
          <span class="block text-[0.74rem] text-muted">On-accent text switches to ink when white would fail.</span>
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="btn btn-primary min-h-10 px-4 text-[0.88rem]" v-motion :hover="pressHover" :tap="pressTap" @click="applyToSite">
            Apply to site
          </button>
          <button type="button" class="btn btn-ghost min-h-10 px-4 text-[0.88rem]" v-motion :hover="pressHover" :tap="pressTap" @click="reset">
            Reset
          </button>
        </div>
        <p class="min-h-5 text-[0.8rem] text-muted" role="status" aria-live="polite">
          {{ notice || (applied ? 'Applied to this page.' : '') }}
        </p>
      </div>
    </div>
  </BentoTile>
</template>


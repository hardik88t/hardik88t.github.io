<script setup lang="ts">
import { computed, ref } from 'vue'
import { content } from '@/lib/content'
import { useRevealOnView } from '@/composables/useRevealOnView'
import BentoTile from './BentoTile.vue'

// Commit split built from two real figures: 139 commits in total, 91 of them in September.
// July and August is the difference, so it is derived, not measured separately.
const total = content.agentic.metrics.find((m) => m.label === 'commits')?.value ?? 0
const september = content.agentic.metrics.find((m) => m.label === 'commits in September')?.value ?? 0
const earlier = total - september
const prs = content.agentic.metrics.find((m) => m.label === 'squash-merged PRs')?.value ?? 0

const R = 74
const C = 2 * Math.PI * R
const wrap = ref<SVGElement | null>(null)
const { progress } = useRevealOnView(wrap, 1400)

const sepLen = computed(() => (september / total) * C * progress.value)
const earlierLen = computed(() => (earlier / total) * C * progress.value)
const sepOffset = 0
const earlierOffset = computed(() => -(september / total) * C * progress.value)
</script>

<template>
  <BentoTile id="commit-split" eyebrow="Data viz / from the repo" title="Where the 139 commits landed">
    <div class="flex flex-1 flex-col items-center gap-5 sm:flex-row sm:items-center lg:flex-col xl:flex-row">
      <svg
        ref="wrap"
        viewBox="0 0 200 200"
        class="size-[11rem] shrink-0 overflow-visible"
        role="img"
        :aria-label="`Donut chart: ${september} commits in September and ${earlier} in July and August, out of ${total} total.`"
      >
        <circle cx="100" cy="100" :r="R" fill="none" stroke="var(--surface-2)" stroke-width="22" />
        <circle
          cx="100"
          cy="100"
          :r="R"
          fill="none"
          stroke="var(--cobalt)"
          stroke-width="22"
          stroke-linecap="butt"
          :stroke-dasharray="`${sepLen} ${C}`"
          :stroke-dashoffset="sepOffset"
          transform="rotate(-90 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          :r="R"
          fill="none"
          stroke="var(--marigold)"
          stroke-width="22"
          :stroke-dasharray="`${earlierLen} ${C}`"
          :stroke-dashoffset="earlierOffset"
          transform="rotate(-90 100 100)"
        />
        <text x="100" y="98" text-anchor="middle" class="mono-num" fill="var(--ink)" style="font-size: 34px; font-weight: 600; letter-spacing: -0.03em">{{ total }}</text>
        <text x="100" y="120" text-anchor="middle" fill="var(--muted)" style="font-size: 12px">commits</text>
      </svg>

      <div class="w-full min-w-0 space-y-4 text-[0.88rem]">
        <div>
          <p class="flex items-center gap-2 font-medium text-ink">
            <span class="inline-block size-3 rounded-[3px] bg-cobalt" aria-hidden="true" />
            September 2026
          </p>
          <p class="mono-num mt-0.5 pl-5 text-[1.25rem] font-semibold text-ink">{{ september }}</p>
          <p class="pl-5 text-[0.76rem] text-muted">Peak day: 16 commits</p>
        </div>
        <div>
          <p class="flex items-center gap-2 font-medium text-ink">
            <span class="inline-block size-3 rounded-[3px] bg-marigold" aria-hidden="true" />
            July and August
          </p>
          <p class="mono-num mt-0.5 pl-5 text-[1.25rem] font-semibold text-ink">{{ earlier }}</p>
          <p class="pl-5 text-[0.76rem] text-muted">{{ total }} minus {{ september }}, derived</p>
        </div>
        <p class="border-t border-line pt-3 text-[0.76rem] leading-snug text-muted">
          Every one of the {{ prs }} squash-merged PRs passed the merge gate.
        </p>
      </div>
    </div>
  </BentoTile>
</template>

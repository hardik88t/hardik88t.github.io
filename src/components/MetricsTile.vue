<script setup lang="ts">
import { computed, ref } from 'vue'
import { content } from '@/lib/content'
import { useRevealOnView } from '@/composables/useRevealOnView'
import BentoTile from './BentoTile.vue'

const { agentic } = content
const wrap = ref<HTMLElement | null>(null)
const { progress } = useRevealOnView(wrap, 1400)

const cells = computed(() =>
  agentic.metrics.map((m) => ({
    ...m,
    shown: Math.round(m.value * progress.value).toLocaleString('en-US'),
  })),
)
</script>

<template>
  <BentoTile id="metrics" eyebrow="Proof, not claims" title="By the numbers">
    <div ref="wrap" class="flex flex-1 flex-col">
      <dl class="grid flex-1 grid-cols-3 grid-rows-3 gap-x-3 gap-y-6">
        <div v-for="cell in cells" :key="cell.label" class="min-w-0 border-t border-line pt-3">
                    <dt class="text-[0.8rem] font-medium leading-snug text-ink">{{ cell.label }}</dt>
          <dd class="m-0 mt-2 flex items-baseline">
            <span class="mono-num text-[clamp(1.55rem,3.3vw,2.35rem)] font-semibold leading-none tracking-[-0.035em] text-ink">{{ cell.shown }}</span>
            <span v-if="cell.unit" class="ml-0.5 text-[1rem] font-medium text-muted">{{ cell.unit }}</span>
          </dd>
          <p class="mt-1 text-[0.72rem] leading-snug text-muted">{{ cell.context }}</p>
        </div>
      </dl>
      <p class="mt-5 text-[0.75rem] text-muted">Source: {{ agentic.scope }}.</p>
    </div>
  </BentoTile>
</template>

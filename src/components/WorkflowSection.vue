<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { content } from '@/lib/content'
import { pressTap } from '@/composables/usePress'

const { agentic } = content
const stages = agentic.pipeline
const active = ref(0)
const current = computed(() => stages[active.value] ?? stages[0]!)
const progress = computed(() => ((active.value + 1) / stages.length) * 100)

const guardrails = agentic.guardrails
const tooling = agentic.tooling
const tabRefs = ref<HTMLElement[]>([])

function select(index: number, focus = false) {
  const next = (index + stages.length) % stages.length
  active.value = next
  if (focus) {
    nextTick(() => tabRefs.value[next]?.focus())
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault()
    select(active.value + 1, true)
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault()
    select(active.value - 1, true)
  } else if (e.key === 'Home') {
    e.preventDefault()
    select(0, true)
  } else if (e.key === 'End') {
    e.preventDefault()
    select(stages.length - 1, true)
  }
}
</script>

<template>
  <section id="workflow" aria-labelledby="workflow-title" class="pt-20 sm:pt-28">
    <div class="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div class="lg:col-span-5">
        <p class="eyebrow">Agent workflow showcase</p>
        <h2 id="workflow-title" class="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Agent-driven <em class="serif-accent text-[1.08em] font-normal tracking-normal text-cobalt-ink">development</em>
        </h2>
        <p class="mt-5 text-[1.2rem] font-medium leading-snug text-ink">{{ agentic.thesis }}</p>
        <p class="mt-4 text-[0.98rem] leading-relaxed text-muted">{{ agentic.summary }}</p>
      </div>

      <div class="min-w-0 lg:col-span-7">
        <div class="tile p-4 sm:p-6">
          <div class="relative mb-4 h-1 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
            <div class="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" :style="{ width: `${progress}%` }" />
          </div>

          <div
            role="tablist"
            aria-label="Delivery pipeline stages"
            class="grid grid-cols-4 gap-1.5 sm:grid-cols-8"
            @keydown="onKey"
          >
            <button
              v-for="(stage, i) in stages"
              :id="`stage-tab-${stage.id}`"
              :key="stage.id"
              :ref="(el) => { if (el) tabRefs[i] = el as HTMLElement }"
              type="button"
              role="tab"
              :aria-selected="active === i"
              :aria-controls="`stage-panel`"
              :tabindex="active === i ? 0 : -1"
              class="flex min-h-14 flex-col items-start justify-between rounded-inner border p-2 text-left transition-colors duration-300"
              :class="
                active === i
                  ? 'border-accent bg-accent text-on-accent'
                  : i < active
                    ? 'border-line bg-surface-2 text-ink'
                    : 'border-line bg-surface text-muted hover:text-ink'
              "
              v-motion
              :tap="pressTap"
              @click="select(i)"
            >
              <span class="mono-num text-[0.66rem] font-semibold opacity-80">0{{ i + 1 }}</span>
              <span class="mt-1 text-[0.78rem] font-semibold leading-tight">{{ stage.title }}</span>
            </button>
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            :aria-labelledby="`stage-tab-${current.id}`"
            tabindex="0"
            class="mt-5 min-h-[13rem] rounded-inner border border-line bg-surface-2 p-5 sm:p-6"
          >
            <p class="eyebrow">{{ current.label }}</p>
            <h3 class="mt-2 text-[1.35rem] font-semibold leading-snug tracking-tight">{{ current.title }}</h3>
            <p class="mt-3 max-w-[60ch] text-[0.98rem] leading-relaxed text-ink">{{ current.detail }}</p>
            <ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Artifacts for this stage">
              <li v-for="artifact in current.artifacts" :key="artifact" class="chip font-mono text-[0.76rem]">{{ artifact }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-12">
      <div class="tile lg:col-span-6">
        <h3 class="text-[1.02rem] font-semibold tracking-tight">Guardrails agents cannot skip</h3>
        <ul class="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <li v-for="rule in guardrails" :key="rule" class="flex items-start gap-2.5 text-[0.9rem] leading-snug">
            <svg class="mt-0.5 size-4 shrink-0 text-sage-ink" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
            <span>{{ rule }}</span>
          </li>
        </ul>
      </div>

      <div class="tile lg:col-span-6">
        <h3 class="text-[1.02rem] font-semibold tracking-tight">Tooling I built around the loop</h3>
        <dl class="mt-4 divide-y divide-line">
          <div v-for="tool in tooling" :key="tool.name" class="py-3 first:pt-0 last:pb-0">
            <dt class="font-mono text-[0.84rem] font-semibold text-ink">{{ tool.name }}</dt>
            <dd class="mt-0.5 text-[0.86rem] leading-snug text-muted">{{ tool.detail }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { content } from '@/lib/content'
import { useDemoLoop } from '@/composables/useDemoLoop'
import BentoTile from './BentoTile.vue'

interface Line {
  n: number
  msg: string
  agent: string
}

const coders = content.agentic.agents.filter((a) => a !== 'CodeRabbit')
const all: Line[] = content.agentic.sampleTasks.map((msg, i) => ({
  n: i + 1,
  msg,
  agent: coders[i % coders.length] ?? '',
}))

const VISIBLE = 6
const shown = ref<Line[]>(all.slice(0, 4))
const cursor = ref(4)
const streamed = computed(() => cursor.value)
const term = useTemplateRef<HTMLElement>('term')

function tick() {
  const next = all[cursor.value % all.length]
  if (!next) return
  cursor.value += 1
  shown.value = [...shown.value, next].slice(-VISIBLE)
}

useDemoLoop(term, tick, 1500)

function gateLine(line: Line) {
  return line.n % 3 === 0 ? 'review: CodeRabbit' : 'gates: passed'
}
</script>

<template>
  <BentoTile id="commit-stream" eyebrow="Commit stream / simulated" title="Conventional commits, agent-authored">
    <div ref="term" class="flex flex-1 flex-col overflow-hidden rounded-inner bg-term text-term-ink">
      <div class="flex items-center justify-between gap-3 border-b border-white/10 px-3.5 py-2.5">
        <p class="font-mono text-[0.72rem] text-white/60">git log --oneline --follow</p>
        <p class="flex items-center gap-1.5 font-mono text-[0.7rem] text-term-accent">
          <span class="demo-live" aria-hidden="true" />
          streaming
        </p>
      </div>
      <ol class="flex min-h-[15rem] flex-1 flex-col gap-2.5 px-3.5 py-3.5 font-mono text-[0.76rem] leading-snug" aria-label="Simulated commit stream">
        <li v-for="line in shown" :key="line.n" class="commit-line grid grid-cols-[2.2rem_minmax(0,1fr)] gap-x-2">
          <span class="text-white/40">#{{ String(line.n).padStart(2, '0') }}</span>
          <span class="min-w-0">
            <span class="block break-words text-white">{{ line.msg }}</span>
            <span class="mt-0.5 block text-[0.68rem] text-white/55">
              <span class="text-term-accent">agent</span> {{ line.agent }} · {{ gateLine(line) }}
            </span>
          </span>
        </li>
        <li class="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-x-2" aria-hidden="true">
          <span class="text-white/40">&nbsp;</span>
          <span class="caret" />
        </li>
      </ol>
      <p class="border-t border-white/10 px-3.5 py-2 font-mono text-[0.68rem] text-white/50">
        {{ streamed }} sample commits streamed. Each agent commit still passes the same local gates.
      </p>
    </div>
  </BentoTile>
</template>

<style scoped>
.commit-line {
  animation: line-in 0.6s var(--ease-out-quint) both;
}
@keyframes line-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .commit-line {
    animation: none;
  }
}
</style>

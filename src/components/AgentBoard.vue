<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { content, initialsOf } from '@/lib/content'
import { useDemoLoop } from '@/composables/useDemoLoop'
import { pressHover, pressTap, reducedMotion } from '@/composables/usePress'
import BentoTile from './BentoTile.vue'

interface Task {
  id: number
  title: string
  agent: string
  stage: number
}

const stages = [
  { label: 'To do', tone: 'text-muted', bar: 'bg-muted' },
  { label: 'Agent working', tone: 'text-cobalt-ink', bar: 'bg-cobalt' },
  { label: 'Review', tone: 'text-marigold-ink', bar: 'bg-marigold' },
  { label: 'Merged', tone: 'text-sage-ink', bar: 'bg-sage' },
] as const

// Agents that write code. CodeRabbit is the reviewer and is shown on the Review column.
const coders = content.agentic.agents.filter((a) => a !== 'CodeRabbit')
const reviewer = 'CodeRabbit'
const seed = [0, 1, 1, 2, 0, 3, 1, 2, 0, 3]

const tasks = ref<Task[]>(
  content.agentic.sampleTasks.map((title, i) => ({
    id: i,
    title,
    agent: coders[i % coders.length] ?? coders[0] ?? '',
    stage: seed[i] ?? 0,
  })),
)
const announcement = ref('')
const board = useTemplateRef<HTMLElement>('board')

const columns = computed(() =>
  stages.map((s, idx) => ({
    ...s,
    idx,
    items: tasks.value.filter((t) => t.stage === idx),
  })),
)

let cursor = 0
function tick() {
  const list = tasks.value
  if (!list.length) return
  const task = list[cursor % list.length]
  cursor += 1
  if (task) task.stage = (task.stage + 1) % stages.length
}

const { hovered, userPaused } = useDemoLoop(board, tick, 1700)

function moveManually(task: Task) {
  task.stage = (task.stage + 1) % stages.length
  const next = stages[task.stage]
  announcement.value = `${task.title} moved to ${next?.label ?? ''}.`
}

function nextLabel(task: Task) {
  return stages[(task.stage + 1) % stages.length]?.label ?? ''
}

function pips(task: Task) {
  return stages.map((_, i) => i <= task.stage)
}
</script>

<template>
  <BentoTile id="agent-board" eyebrow="Live simulation" title="Agent board: tasks move from spec to merge">
    <template #action>
      <button
        type="button"
        class="btn btn-ghost min-h-9 px-3 py-1.5 text-[0.82rem]"
        :aria-pressed="userPaused"
        v-motion
        :hover="pressHover"
        :tap="pressTap"
        @click="userPaused = !userPaused"
      >
        {{ userPaused ? 'Resume board' : 'Pause board' }}
      </button>
    </template>

    <div
      ref="board"
      class="flex flex-1 flex-col gap-3"
      @pointerenter="hovered = true"
      @pointerleave="hovered = false"
      @focusin="hovered = true"
      @focusout="hovered = false"
    >
      <p class="text-[0.85rem] leading-relaxed text-muted">
        Each card is a sample task from the agent backlog. Agents pick it up in its own worktree, and it moves to merged only after the gates pass.
        {{ reducedMotion ? 'Motion is reduced, so the board is static. Select a card to move it.' : 'The board hovers pause, and you can select a card to move it yourself.' }}
      </p>

      <div class="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
        <div
          v-for="col in columns"
          :key="col.label"
          class="flex min-w-0 flex-col rounded-inner border border-line bg-surface-2 p-2"
        >
          <div class="mb-2 flex items-center justify-between gap-2 px-1">
            <h3 class="text-[0.78rem] font-semibold" :class="col.tone">{{ col.label }}</h3>
            <span class="mono-num rounded-full bg-surface px-2 py-0.5 text-[0.7rem] font-semibold text-ink ring-1 ring-line">{{ col.items.length }}</span>
          </div>
          <TransitionGroup name="card" tag="ul" class="flex min-h-[7.5rem] flex-col gap-2">
            <li v-for="task in col.items" :key="task.id" class="list-none">
              <button
                type="button"
                class="kcard group w-full rounded-[calc(var(--radius-inner)*0.85)] border border-line bg-surface p-2.5 text-left shadow-[var(--shadow)]"
                :aria-label="`${task.title}. Move to ${nextLabel(task)}`"
                @click="moveManually(task)"
              >
                <span class="block font-mono text-[0.76rem] leading-snug text-ink">{{ task.title }}</span>
                <span class="mt-2 flex items-center justify-between gap-2">
                  <span class="chip px-1.5 py-0 text-[0.66rem] font-semibold" :title="task.agent" :aria-hidden="true">
                    <span class="font-mono">{{ initialsOf(task.agent) }}</span>
                    <span class="hidden font-normal text-muted sm:inline">{{ task.agent }}</span>
                  </span>
                  <span class="flex gap-0.5" aria-hidden="true">
                    <span
                      v-for="(on, i) in pips(task)"
                      :key="i"
                      class="h-1 w-2.5 rounded-full transition-colors duration-300"
                      :class="on ? stages[task.stage]?.bar : 'bg-line'"
                    />
                  </span>
                </span>
              </button>
            </li>
          </TransitionGroup>
          <p v-if="col.idx === 2" class="mt-2 px-1 text-[0.68rem] text-muted">Reviewed by {{ reviewer }}</p>
        </div>
      </div>
      <p class="sr-only" aria-live="polite">{{ announcement }}</p>
    </div>
  </BentoTile>
</template>

<style scoped>
.kcard {
  transition: transform 0.45s var(--ease-spring), box-shadow 0.3s ease, border-color 0.3s ease;
}
@media (hover: hover) {
  .kcard:hover {
    transform: translateY(-2px);
    border-color: var(--line-strong);
    box-shadow: var(--shadow-lift);
  }
}
.kcard:active {
  transform: scale(0.97);
}
</style>

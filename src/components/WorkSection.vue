<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { CATEGORY_LABELS, content, type Project } from '@/lib/content'
import { pressHover, pressTap } from '@/composables/usePress'
import ProjectVisual from './ProjectVisual.vue'

// Public-facing titles for items flagged as anonymised. Client names never appear.
const GENERIC_TITLE: Record<string, string> = {
  anvika: 'Admin and client dashboard',
}
const displayTitle = (p: Project) => GENERIC_TITLE[p.slug] ?? p.title

const categories = computed(() => {
  const seen = new Set<string>()
  content.projects.forEach((p) => p.categories.forEach((c) => seen.add(c)))
  return [...seen].sort((a, b) => (CATEGORY_LABELS[a] ?? a).localeCompare(CATEGORY_LABELS[b] ?? b))
})

// Featured work first, then everything else, keeping the content order inside each group.
const ordered = [...content.projects].sort((a, b) => Number(b.featured) - Number(a.featured))

const filter = ref<string>('all')
const visible = computed(() =>
  filter.value === 'all' ? ordered : ordered.filter((p) => p.categories.includes(filter.value)),
)

const selected = ref<Project | null>(null)
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const lastTrigger = ref<HTMLElement | null>(null)

function openDetail(p: Project, event: MouseEvent) {
  selected.value = p
  lastTrigger.value = event.currentTarget as HTMLElement
  dialog.value?.showModal()
  document.documentElement.style.overflow = 'hidden'
}

function closeDetail() {
  dialog.value?.close()
}

function onDialogClose() {
  selected.value = null
  document.documentElement.style.overflow = ''
  lastTrigger.value?.focus()
}

// Clicking the backdrop (the dialog element itself, outside its padded content) closes it.
function onBackdrop(e: MouseEvent) {
  if (e.target === dialog.value) closeDetail()
}

function linksOf(p: Project) {
  if (p.anonymized) return []
  return Object.entries(p.links)
    .filter(([, href]) => typeof href === 'string' && href.length > 0)
    .map(([kind, href]) => ({ kind, href: href as string }))
}

const linkLabel: Record<string, string> = { github: 'GitHub', live: 'Live site' }
</script>

<template>
  <section id="work" aria-labelledby="work-title" class="pt-20 sm:pt-28">
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div class="max-w-[46rem]">
        <p class="eyebrow">Selected work</p>
        <h2 id="work-title" class="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Products I shipped, and the <em class="serif-accent text-[1.08em] font-normal tracking-normal text-plum-ink">tooling</em> behind them
        </h2>
        <p class="mt-4 max-w-[60ch] text-[0.98rem] leading-relaxed text-muted">
          Filter by discipline. Items marked anonymised describe client work without naming the client.
        </p>
      </div>
    </div>

    <div class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
      <button
        type="button"
        class="chip min-h-11 cursor-pointer px-3.5 text-[0.84rem] font-semibold transition-colors"
        :class="filter === 'all' ? 'border-accent bg-accent text-on-accent' : 'hover:border-line-strong'"
        :aria-pressed="filter === 'all'"
        v-motion
        :tap="pressTap"
        @click="filter = 'all'"
      >
        All <span class="mono-num opacity-75">{{ content.projects.length }}</span>
      </button>
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="chip min-h-11 cursor-pointer px-3.5 text-[0.84rem] font-semibold transition-colors"
        :class="filter === cat ? 'border-accent bg-accent text-on-accent' : 'hover:border-line-strong'"
        :aria-pressed="filter === cat"
        v-motion
        :tap="pressTap"
        @click="filter = cat"
      >
        {{ CATEGORY_LABELS[cat] ?? cat }}
        <span class="mono-num opacity-75">{{ content.projects.filter((p) => p.categories.includes(cat)).length }}</span>
      </button>
    </div>

    <p class="mt-4 text-[0.82rem] text-muted" aria-live="polite">
      Showing {{ visible.length }} of {{ content.projects.length }} projects.
    </p>

    <TransitionGroup tag="ul" name="filter" class="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="p in visible" :key="p.slug" class="list-none">
        <article
          class="work-card group flex h-full flex-col overflow-hidden rounded-tile border border-line bg-surface shadow-[var(--shadow)]"
        >
          <ProjectVisual :categories="p.categories" :accent="p.accent" />
          <div class="flex flex-1 flex-col p-5">
            <div class="flex items-center justify-between gap-3">
              <p class="mono-num text-[0.74rem] font-semibold text-muted">{{ p.year }} · {{ p.role }}</p>
              <div class="flex flex-wrap justify-end gap-1.5">
                <span v-if="p.featured" class="chip px-2 py-0 text-[0.68rem] font-semibold">Featured</span>
                <span v-if="p.anonymized" class="chip px-2 py-0 text-[0.68rem]">Anonymised</span>
              </div>
            </div>
            <h3 class="mt-2 text-[1.2rem] font-semibold leading-snug tracking-tight">{{ displayTitle(p) }}</h3>
            <p class="mt-2 text-[0.92rem] leading-relaxed text-muted">{{ p.oneLiner }}</p>

            <ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Categories">
              <li v-for="c in p.categories" :key="c" class="rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ring-1 ring-line" :style="{ color: `color-mix(in oklab, ${p.accent} 70%, var(--ink))` }">
                {{ CATEGORY_LABELS[c] ?? c }}
              </li>
            </ul>

            <ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
              <li v-for="tech in p.stack.slice(0, 5)" :key="tech" class="chip px-2 py-0 text-[0.72rem] text-muted">{{ tech }}</li>
              <li v-if="p.stack.length > 5" class="chip px-2 py-0 text-[0.72rem] text-muted">+{{ p.stack.length - 5 }}</li>
            </ul>

            <div class="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <button
                type="button"
                class="btn btn-ghost min-h-11 px-3.5 text-[0.86rem]"
                :aria-label="`Details: ${displayTitle(p)}`"
                v-motion
                :hover="pressHover"
                :tap="pressTap"
                @click="openDetail(p, $event)"
              >
                View details
              </button>
              <ul class="flex flex-wrap gap-3 text-[0.84rem]">
                <li v-for="l in linksOf(p)" :key="l.kind">
                  <a :href="l.href" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-11 items-center gap-1 font-semibold text-cobalt-ink underline decoration-1 underline-offset-4">
                    {{ linkLabel[l.kind] ?? l.kind }}<span class="sr-only"> (opens in a new tab)</span>
                    <svg class="size-3.5" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h7v7M13 3 6.5 9.5M11 9.5V13H3V5h3.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </li>
    </TransitionGroup>

    <dialog
      ref="dialog"
      class="project-dialog"
      aria-labelledby="project-dialog-title"
      @close="onDialogClose"
      @click="onBackdrop"
    >
      <article v-if="selected" class="flex max-h-[min(88dvh,46rem)] flex-col">
        <ProjectVisual :categories="selected.categories" :accent="selected.accent" />
        <div class="overflow-y-auto p-5 sm:p-7">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <p class="mono-num text-[0.76rem] font-semibold text-muted">{{ selected.year }} · {{ selected.role }}</p>
              <h3 id="project-dialog-title" class="mt-1.5 text-[1.5rem] font-semibold leading-tight tracking-tight">{{ displayTitle(selected) }}</h3>
            </div>
            <button type="button" class="btn btn-ghost size-11 shrink-0 p-0" aria-label="Close details" @click="closeDetail">
              <svg class="size-4" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" /></svg>
            </button>
          </div>
          <p class="mt-4 text-[1rem] leading-relaxed text-ink">{{ selected.oneLiner }}</p>
          <p class="mt-3 text-[0.94rem] leading-relaxed text-muted">{{ selected.description }}</p>

          <h4 class="eyebrow mt-6">Highlights</h4>
          <ul class="mt-2 grid gap-2 sm:grid-cols-2">
            <li v-for="h in selected.highlights" :key="h" class="flex items-start gap-2 rounded-inner bg-surface-2 p-3 text-[0.86rem] leading-snug">
              <span class="mt-[0.45em] size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {{ h }}
            </li>
          </ul>

          <h4 class="eyebrow mt-6">Stack</h4>
          <ul class="mt-2 flex flex-wrap gap-1.5">
            <li v-for="tech in selected.stack" :key="tech" class="chip text-[0.78rem]">{{ tech }}</li>
          </ul>

          <p v-if="selected.anonymized" class="mt-6 rounded-inner border border-dashed border-line-strong p-3 text-[0.82rem] leading-snug text-muted">
            Client details are withheld. This summary describes the work, not the client.
          </p>

          <ul v-if="linksOf(selected).length" class="mt-6 flex flex-wrap gap-2">
            <li v-for="l in linksOf(selected)" :key="l.kind">
              <a :href="l.href" target="_blank" rel="noopener noreferrer" class="btn btn-ghost min-h-11 text-[0.86rem]">
                {{ linkLabel[l.kind] ?? l.kind }}<span class="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </article>
    </dialog>
  </section>
</template>

<style scoped>
.work-card {
  transition: transform 0.5s var(--ease-spring), box-shadow 0.4s ease, border-color 0.3s ease;
}
@media (hover: hover) {
  .work-card:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lift);
    border-color: var(--line-strong);
  }
}

.project-dialog {
  width: min(44rem, calc(100% - 1.5rem));
  max-width: none;
  margin: auto;
  padding: 0;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-tile, 20px);
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 30px 80px -30px rgb(0 0 0 / 0.55);
  overflow: hidden;
}
.project-dialog::backdrop {
  background: color-mix(in oklab, var(--ink) 45%, transparent);
  backdrop-filter: blur(3px);
}
.project-dialog[open] {
  animation: dialog-in 0.4s var(--ease-out-quint);
}
@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .project-dialog[open] {
    animation: none;
  }
}
</style>

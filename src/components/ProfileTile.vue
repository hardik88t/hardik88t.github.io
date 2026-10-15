<script setup lang="ts">
import { computed, ref } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import { content } from '@/lib/content'
import { pressHover, pressTap } from '@/composables/usePress'

const { profile, agentic } = content
const now = ref(new Date())
useIntervalFn(() => {
  now.value = new Date()
}, 30_000)

const localTime = computed(() => {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now.value)
  } catch {
    return '--:--'
  }
})

// The one italic serif word in the headline (kept in sync with content.profile.headline).
const emphasis = 'production'
const [before = '', after = profile.headline] = profile.headline.includes(emphasis)
  ? profile.headline.split(emphasis)
  : [profile.headline, '']
</script>

<template>
  <section id="top" aria-labelledby="hero-title" class="tile profile-tile">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <span
          class="grid size-12 place-items-center rounded-[var(--radius-inner)] bg-accent text-[0.95rem] font-semibold tracking-wide text-on-accent"
          aria-hidden="true"
        >
          {{ profile.monogram }}
        </span>
        <div class="min-w-0 leading-tight">
          <p class="text-[0.95rem] font-semibold text-ink">{{ profile.name }}</p>
          <p class="text-[0.82rem] text-muted">{{ profile.role }}</p>
        </div>
      </div>
      <p class="chip text-[0.78rem]">
        <span class="demo-live" aria-hidden="true" />
        <span class="mono-num">{{ profile.location }}, {{ localTime }} IST</span>
      </p>
    </div>

    <h1 id="hero-title" class="mt-8 text-[clamp(2.25rem,5.2vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink">
      {{ before }}<em class="serif-accent text-[1.06em] font-normal tracking-normal text-cobalt-ink">{{ emphasis }}</em>{{ after }}
    </h1>

    <p class="mt-5 max-w-[58ch] text-[1.02rem] leading-relaxed text-muted">
      {{ profile.sub }}
    </p>

    <div class="mt-7 flex flex-wrap items-center gap-2.5">
      <a href="#contact" v-motion :hover="pressHover" :tap="pressTap" class="btn btn-primary">Start a project</a>
      <a href="#workflow" v-motion :hover="pressHover" :tap="pressTap" class="btn btn-ghost">See the agent workflow</a>
      <a
        :href="profile.links.cv"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-quiet text-[0.92rem]"
      >
        Read CV (PDF)<span class="sr-only"> (opens in a new tab)</span>
        <svg class="size-3.5" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h7v7M13 3 6.5 9.5M11 9.5V13H3V5h3.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      </a>
    </div>

    <div class="mt-auto pt-8">
      <p class="chip mb-3 text-[0.78rem]">
        <span class="demo-live" aria-hidden="true" />
        {{ profile.availability }}
      </p>
      <p class="eyebrow mb-2">Agents in the loop</p>
      <ul class="flex flex-wrap gap-1.5" aria-label="Agents used in the delivery pipeline">
        <li v-for="agent in agentic.agents" :key="agent" class="chip text-[0.78rem]">{{ agent }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.profile-tile {
  background:
    radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--accent) 9%, transparent), transparent 60%),
    var(--surface);
}
</style>
